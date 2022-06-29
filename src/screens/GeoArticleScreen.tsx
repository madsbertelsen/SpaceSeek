import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

import { RegularText } from '../components/Basic/Basic';
import { BlurView } from '@react-native-community/blur';
import { ThemedStatusBar } from '../components/ThemedStatusBar/ThemedStatusBar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
export interface DetailsScreenIncomeParamsProps {
  id?: string;
}

export interface DetailsScreenProps {
  route?: {
    params?: DetailsScreenIncomeParamsProps;
  };
}
const { height, width } = RN.Dimensions.get('screen');

const IntroContent = (content: Feature) => {
  const features = useSelector((state: RootState) => state.features.features);
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

  const strokeColor = 'black';

  return (
    <>
      {content.description && (
        <RN.View style={{ padding: 20 }}>
          <ReadMore
            style={{ flex: 1, width: '100%', padding: 20 }}
            numberOfLines={3}
            renderTruncatedFooter={renderTruncatedFooter}
            renderRevealedFooter={renderRevealedFooter}
            onReady={handleTextReady}>
            <RegularText size="l" fontType="regular">
              {content.description}
            </RegularText>
          </ReadMore>
        </RN.View>
      )}
    </>
  );
};

export const GeoArticleScreen = (props: DetailsScreenProps) => {
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
  const bbox = content.bbox;
  const bounds = { sw: [bbox[0], bbox[1]], ne: [bbox[2], bbox[3]] };

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [height / 3, 2 * (height / 3)], []);

  const [paddingBottom, setPaddingBottom] = useState<number>(
    snapPoints[1] + 50,
  );

  const ss: ScrollEventHandlerCallbackType = (_payload, _context) => {};
  const ob: ScrollEventsHandlersHookType = (
    _ref: any,
    _contentYOffset: any,
  ) => {
    return {
      /*
      handleOnScroll: ss,
      handleOnBeginDrag: ss,
      handleOnEndDrag: ss,
      handleOnMomentumBegin: ss,
      handleOnMomentumEnd: ss,
      */
    };
  };
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    const pad = snapPoints[index];
    setPaddingBottom(pad + 50);
  }, []);

  if (!content) {
    return (
      <>
        <BlurView style={[styles.img]} />
        <ActivityIndicator style={{ marginTop: 16 }} />
      </>
    );
  }

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
            //styleURL={style}

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
            <MapboxGL.ShapeSource
              id="mapstory"
              shape={{
                type: 'FeatureCollection',
                features: [
                  {
                    ...content,
                    type: 'Feature',
                    properties: {
                      ...(content as any).properties,
                      color: theme.focusedIconColor,
                    },
                  } as any,
                ],
              }}
            />
          </MapboxGL.MapView>
          <BottomSheet
            /*
            handleComponent={() => (
              <RN.View
                style={{
                  padding: 20,
                  borderTopColor: '#cccccc',
                  borderTopWidth: 4,
                }}>
                <RegularText size="xxl" fontType="bold">
                  {content.name}
                </RegularText>
              </RN.View>
            )}
            */
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            <BottomSheetScrollView
              //     scrollEventsHandlersHook={ob}
              nestedScrollEnabled
              //scrollEnabled={false}
              // scrollEventThrottle={16}
              style={{ flex: 1, width: '100%' }}>
              <RN.View
                style={{
                  paddingVertical: 0,
                  paddingHorizontal: 20,
                }}>
                <RegularText size="xxl" fontType="bold">
                  {content.name}
                </RegularText>
              </RN.View>
              <IntroContent {...content} />
              <RN.View
                style={{
                  width: '100%',
                  paddingBottom: 30,
                }}>
                {content.sub_categories.map((cat) => {
                  return <SectionContent rel={cat} context={content} />;
                })}

                {/*
        content.subCategories.length > 0 && (
          <WaypointSlider items={content.subCategories[0].references} />
        )
        */}
              </RN.View>
            </BottomSheetScrollView>
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
});
