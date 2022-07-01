import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

import { RegularText } from '../components/Basic/Basic';
import { BlurView } from '@react-native-community/blur';
import { ThemedStatusBar } from '../components/ThemedStatusBar/ThemedStatusBar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as RN from 'react-native';
import ReadMore from 'react-native-read-more-text';
import MapboxGL from '@rnmapbox/maps';
import { useTheme } from 'styled-components';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetSectionList,
  ScrollEventHandlerCallbackType,
  ScrollEventsHandlersHookType,
} from '@gorhom/bottom-sheet';
import { SectionContent } from './components/SectionContent';
import { loadTour, setFocusWaypoint } from '../redux/reducers/tourSlice';
import { Waypoint } from './components/WaypointList';
import ImageCollage from './components/ImageCollage';
import { ContentSection } from '../components/LaunchContent/LaunchContent.styled';
import { difference, bboxPolygon, feature, bbox } from '@turf/turf';
import { ScrollView } from 'react-native-gesture-handler';
import {
  popScreen,
  pushScreen,
  setBounds,
} from '../redux/reducers/configSlice';
export interface DetailsScreenIncomeParamsProps {
  id?: string;
}

export interface SheetProps {
  snapPoints: number[];
  onDismiss: () => void;
  handleSheetChange: (index: number) => void;
  onPush: (id: number) => void;
  id: number;
}
const { height, width } = RN.Dimensions.get('screen');

export const Sheet = ({
  id,
  onDismiss,
  onPush,
  snapPoints,
  handleSheetChange,
}: SheetProps) => {
  const dispatch = useDispatch();
  const features = useSelector((state: RootState) => state.features.features);

  const content = features.find((f) => f.id === id)!;

  const theme = useTheme();
  const tour = useSelector((state: RootState) => state.tour);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables

  useEffect(() => {
    bottomSheetModalRef!.current!.present();
  }, [id]);

  useEffect(() => {
    if (content.geometry.type !== 'LineString') {
      return;
    }
    const waypointIds = content.sub_categories[0].screens.map((s) => s.id);

    const b = bbox(feature(content.geometry));
    dispatch(setBounds({ bounds: b } as any));

    dispatch(
      loadTour({
        lineFeature: content,
        pointFeatures: features.filter((f) => waypointIds.includes(f.id)),
      }),
    );
  }, []);

  // render
  const renderSectionHeader = useCallback(
    ({ section }) => (
      <RN.View
        style={{
          backgroundColor: 'white',
          paddingVertical: 0,
          paddingHorizontal: 20,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 15 },
          shadowColor: 'black',
          shadowOpacity: 0.0,
        }}>
        <RegularText size="xxl" fontType="bold">
          {section.title}
        </RegularText>
      </RN.View>
    ),
    [],
  );
  const renderTruncatedFooter = (handlePress: any) => {
    return (
      <RegularText onPress={handlePress} size="xl" fontType="regular">
        Read more
      </RegularText>
    );
  };

  const renderRevealedFooter = (handlePress: any) => {
    return <RN.Text onPress={handlePress}>Show less</RN.Text>;
  };

  const handleTextReady = () => {
    // ...
  };
  const renderItem = useCallback((prop) => {
    if (prop.item.type === 'vertical_waypoints') {
      return (
        <Waypoint
          key={prop.item.index}
          idx={prop.item.index}
          onPress={() =>
            dispatch(pushScreen({ id: tour.features[prop.item.index].id }))
          }
        />
      );
    } else if (prop.item.type === 'description') {
      return (
        <RN.View style={{ padding: 20 }}>
          <ReadMore
            style={{ flex: 1, width: '100%', padding: 20 }}
            numberOfLines={3}
            renderTruncatedFooter={renderTruncatedFooter}
            renderRevealedFooter={renderRevealedFooter}
            onReady={handleTextReady}>
            <RegularText size="l" fontType="regular">
              {prop.item.value}
            </RegularText>
          </ReadMore>
          {content.photos && content.photos.length > 0 && (
            <ImageCollage
              height={400}
              containerStyle={{ width: '100%' }}
              images={content.photos}
              onPressImage={(uri) => {
                console.log('');
              }}
              matrix={[
                1,
                content.photos.length > 3 ? 3 : content.photos.length - 1,
              ]}
            />
          )}
        </RN.View>
      );
    } else if (prop.item.type === 'horizontal') {
      return (
        <ScrollView
          style={{ backgroundColor: prop.item.backgroundColor }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {prop.item.cardElements.map((f) => (
            <RN.Pressable
              onPress={() => {
                onPush(f.id);
              }}>
              <RN.View
                style={{
                  margin: 30,
                  backgroundColor: 'gray',
                  height: 200,
                  width: 200,
                }}>
                <RN.Image
                  style={{
                    height: 200,
                    width: 200,
                  }}
                  source={{ uri: f.img }}
                />
                <RN.View
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    padding: 10,
                    paddingLeft: 0,
                    zIndex: 10,
                    top: 0,
                    left: 0,
                    flex: 1,
                  }}>
                  <RegularText size="l" fontType="bold">
                    {f.name}
                  </RegularText>
                </RN.View>
              </RN.View>
            </RN.Pressable>
          ))}
        </ScrollView>
      );
    } else {
      return (
        <RN.View>
          <RN.Text>{JSON.stringify(prop.item)}</RN.Text>
        </RN.View>
      );
    }
  }, []);

  // variables
  const sections = useMemo(
    () => [
      {
        title: content.name,
        data: [{ value: content.description, type: 'description' }],
      },
      ...content.sub_categories.map((cat) => ({
        title: cat.name,
        data:
          cat.card_layout === 'horizontal'
            ? [
                {
                  type: cat.card_layout,
                  cardElements: cat.screens.map((s) => {
                    return features.find((f) => f.id === s.id);
                  }),
                },
              ]
            : cat.screens.map((f: any, index) => {
                return { index, type: cat.card_layout };
              }),
      })),
    ],
    [content, tour.features],
  );

  return (
    <BottomSheetModal
      stackBehavior="push"
      index={1}
      snapPoints={snapPoints}
      ref={bottomSheetModalRef}
      onDismiss={() => {
        console.log('dismissssss ');
        dispatch(popScreen());
        // bottomSheetModalRef.current!.present();
      }}
      style={{
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 20,
      }}
      onChange={handleSheetChange}>
      <BottomSheetSectionList
        bounces={false}
        viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
        onViewableItemsChanged={(ev) => {
          const firstIndex =
            ev.viewableItems.length === 0
              ? 0
              : ev.viewableItems[0].index === null
              ? 0
              : ev.viewableItems[0].index;

          if (firstIndex !== tour.focusWaypointIndex) {
            dispatch(setFocusWaypoint({ index: firstIndex }));
          }
        }}
        sections={sections}
        keyExtractor={(i) => i.index}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
      />
    </BottomSheetModal>
  );
};

const styles = RN.StyleSheet.create({
  img: {
    backgroundColor: '#ccc',
    width: '100%',
    height: '40%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  padImg: {
    marginVertical: 16,
    width: '80%',
    height: 160,
    alignSelf: 'center',
    borderRadius: 8,
  },
  wiki: {
    paddingHorizontal: 2,
    paddingVertical: 4,
    backgroundColor: 'red',
  },
  videoItem: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 },
  },
  sectionHeaderContainer: {
    backgroundColor: 'white',
    padding: 6,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});
