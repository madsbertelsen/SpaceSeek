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
import { Sheet } from './Sheet';
import { pushScreen, setBounds } from '../redux/reducers/configSlice';
import { config } from '../config/config';
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
  const box = content.bbox;

  const cameraRef = useRef<MapboxGL.Camera>();
  const mapRef = useRef<MapboxGL.MapView>();
  // variables
  const snapPoints = useMemo(() => [height / 3, 2 * (height / 3)], []);

  const bounds = useMemo(() => {
    const bo = conf.bounds;

    if (bo) {
      const temp = { sw: [bo[0], bo[1]], ne: [bo[2], bo[3]] };
      return temp;
    } else {
      return { sw: [box[0], box[1]], ne: [box[2], box[3]] };
    }

    //const b = bbox(feature(tour.tour.geometry));
    //return { sw: [b[0], b[1]], ne: [b[2], b[3]] };
  }, [conf.bounds]);

  const padding = useMemo(() => {
    return conf.padding;

    //const b = bbox(feature(tour.tour.geometry));
    //return { sw: [b[0], b[1]], ne: [b[2], b[3]] };
  }, [conf.bounds]);

  const [paddingBottom, setPaddingBottom] = useState<number>(
    snapPoints[1] + 50,
  );

  useEffect(() => {
    if (!conf.bounds) {
      dispatch(
        setBounds({
          bounds: box,
          padding: {
            paddingBottom: paddingBottom,
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 50,
          },
        }),
      );
    }
  }, []);

  const handleSheetChange = useCallback((index: number) => {
    const pad = snapPoints[index];
    //    setPaddingBottom(pad + 5);
  }, []);

  const mapFeatures = useMemo(() => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: ['Polygon', 'MultiPolygon'].includes(content.geometry.type)
        ? [
            difference(
              bboxPolygon([0, 0, 90, 90]),
              // bboxPolygon(bbox as any),
              feature(content.geometry) as any,
            ),
          ]
        : [],
    } as any;
    if (!tour) {
      return featureCollection;
    }

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

  return (
    <>
      <BottomSheetModalProvider>
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
            {bounds && (
              <MapboxGL.MapView
                styleJSON={JSON.stringify(mapStyle)}
                ref={mapRef as any}
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
                  ref={cameraRef as any}
                  defaultSettings={{
                    animationMode: 'flyTo',
                    animationDuration: 1,
                  }}
                  //   centerCoordinate={content.geometry.coordinates}
                  animationDuration={300}
                  bounds={bounds}
                  padding={padding}
                  /*
                  padding={{
                    paddingBottom: paddingBottom,
                    paddingLeft: 50,
                    paddingRight: 50,
                    paddingTop: 50,
                  }}
                  */
                />
                <MapboxGL.ShapeSource
                  id="mapstory"
                  shape={mapFeatures as any}
                />
              </MapboxGL.MapView>
            )}
            {conf.screenStack.map((screen) => (
              <Sheet
                handleSheetChange={handleSheetChange}
                snapPoints={snapPoints}
                onDismiss={() => {}}
                onPush={async (idx) => {
                  console.log(cameraRef.current?.state);
                  const bo = await mapRef.current?.getVisibleBounds()!;
                  const bou = [bo[1][0], bo[1][1], bo[0][0], bo[0][1]];
                  console.log(bou);
                  dispatch(
                    pushScreen({
                      id: idx,
                      bounds: bou,
                    }),
                  );
                }}
                key={screen.id}
                id={screen.id}
              />
            ))}
          </RN.View>
        </RN.View>
      </BottomSheetModalProvider>
    </>
  );
};
