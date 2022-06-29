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
export interface DetailsScreenIncomeParamsProps {
  id?: string;
}

export interface DetailsScreenProps {
  route?: {
    params?: DetailsScreenIncomeParamsProps;
  };
}
const { height, width } = RN.Dimensions.get('screen');

export const TourArticleScreen = (props: DetailsScreenProps) => {
  const dispatch = useDispatch();
  const [error, setError] = React.useState(false);
  const { t } = useTranslation();
  const features = useSelector((state: RootState) => state.features.features);
  // const feature = useSelector((state: RootState) => state.features.features[0]);
  const conf = useSelector((state: RootState) => state.config);
  console.log(conf);
  const id = props.route?.params?.id
    ? parseInt(props.route?.params?.id!)
    : conf.root_screen_id;
  const content = features.find((f) => f.id === id)!;
  const theme = useTheme();
  const mapStyle = useSelector((state: RootState) => state.map.style);
  const tour = useSelector((state: RootState) => state.tour);
  //  const features = useSelector((state: RootState) => state.tour.features);

  const bbox = content.bbox;
  const bounds = { sw: [bbox[0], bbox[1]], ne: [bbox[2], bbox[3]] };

  // variables
  const snapPoints = useMemo(() => [height / 3, 2 * (height / 3)], []);

  const [paddingBottom, setPaddingBottom] = useState<number>(
    snapPoints[1] + 50,
  );

  const mapFeatures = useMemo(() => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [],
    } as any;
    if (!tour) {
      return featureCollection;
    }
    featureCollection.features.push({
      geometry: content.geometry,
      type: 'Feature',
      properties: {
        ...(content as any).properties,
        color: 'black',
      },
    });
    if (tour.elapsedRoute) {
      featureCollection.features.push({
        geometry: tour.elapsedRoute,
        type: 'Feature',
        properties: {
          ...(content as any).properties,
          color: theme.focusedIconColor,
        },
      });
    }

    /*
      featureCollection.features.push(
       as any);
      */

    if (tour.focusWaypoint) {
      featureCollection.features.push({
        ...tour.focusWaypoint,
        properties: {
          index: tour.focusWaypoint.symbol,
          color: theme.focusedIconColor,
        },
        type: 'Feature',
      });
    }
    return featureCollection;
  }, [tour.focusWaypoint, tour.elapsedRoute]);

  useEffect(() => {
    const waypointIds = content.sub_categories[0].screens.map((s) => s.id);
    dispatch(
      loadTour({
        lineFeature: content,
        pointFeatures: features.filter((f) => waypointIds.includes(f.id)),
      }),
    );
  }, []);

  // callbacks
  if (!content) {
    return (
      <>
        <BlurView style={[styles.img]} />
        <ActivityIndicator style={{ marginTop: 16 }} />
      </>
    );
  }
  const handleSheetChanges = useCallback((index: number) => {
    const pad = snapPoints[index];
    setPaddingBottom(pad + 50);
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
    if (prop.item.type === 'waypoint') {
      return <Waypoint key={prop.item.index} idx={prop.item.index} />;
    }

    console.log(JSON.stringify(prop, null, 4));
    return (
      <RN.View style={{ padding: 20 }}>
        <RegularText size="xl" fontType="regular">
          vandring, 20,3 km.,* 5-8 timer
        </RegularText>

        <ReadMore
          style={{ flex: 1, width: '100%', padding: 20 }}
          numberOfLines={3}
          renderTruncatedFooter={renderTruncatedFooter}
          renderRevealedFooter={renderRevealedFooter}
          onReady={handleTextReady}>
          <RegularText size="l" fontType="regular">
            {prop.item}
          </RegularText>
        </ReadMore>
        {content.photos && content.photos.length > 0 && (
          <ImageCollage
            height={400}
            containerStyle={{ width: '100%' }}
            images={content.photos}
            onPressImage={(uri) => {
              console.log('');
              //handleShowModalImage(uri)}
            }}
            matrix={[
              1,
              content.photos.length > 3 ? 3 : content.photos.length - 1,
            ]}
          />
        )}
      </RN.View>
    );
  }, []);
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const sections = useMemo(
    () => [
      {
        title: content.name,
        data: [content.description],
      },
      ...content.sub_categories.map((cat) => ({
        title: cat.name,
        data: cat.screens.map((f: any, index) => {
          return { index, type: 'waypoint' };
        }),
      })),
    ],
    [content, tour.features],
  );

  return (
    <>
      <ThemedStatusBar barStyle="dark-content" />
      <RN.View
        style={{
          padding: 16,
          shadowRadius: 8,
          shadowOffset: [5, 5],
          shadowOpacity: 0.3,
          shadowColor: 'black',
          borderRadius: 8,
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}>
        <RN.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}>
          <MapboxGL.MapView
            styleJSON={JSON.stringify(mapStyle)}
            logoEnabled={false}
            style={{
              flex: 1,
              height: 300,
              marginHorizontal: content.marginHorizontal,
            }}>
            {/*
        <MapboxGL.UserLocation />
        */}
            <MapboxGL.Camera
              defaultSettings={{
                animationMode: 'flyTo',
                animationDuration: 1,
              }}
              //   centerCoordinate={content.geometry.coordinates}
              animationDuration={100}
              bounds={bounds}
              padding={{
                paddingBottom: paddingBottom,
                paddingLeft: 50,
                paddingRight: 50,
                paddingTop: 50,
              }}
            />
            <MapboxGL.ShapeSource id="mapstory" shape={mapFeatures as any} />
          </MapboxGL.MapView>
          <BottomSheet
            ref={sheetRef}
            index={1}
            snapPoints={snapPoints}
            style={{
              shadowColor: 'black',
              shadowOpacity: 0.5,
              shadowRadius: 20,
            }}
            onChange={handleSheetChanges}>
            <BottomSheetSectionList
              viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
              onViewableItemsChanged={(ev) => {
                /*
                console.log(
                  'count ',
                  ev.viewableItems.length,
                  '------------------------',
                );
                */
                const firstIndex =
                  ev.viewableItems.length === 0
                    ? 0
                    : ev.viewableItems[0].index === null
                    ? 0
                    : ev.viewableItems[0].index;
                for (const viewableItem of ev.viewableItems) {
                  console.log(JSON.stringify(viewableItem, null, 4));
                }

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
          </BottomSheet>
        </RN.View>
      </RN.View>
    </>
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
