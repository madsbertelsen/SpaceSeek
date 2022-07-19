import { useTranslation } from 'react-i18next';

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
import MapboxGL from '@rnmapbox/maps';
import { useTheme } from 'styled-components';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { difference, bboxPolygon, feature } from '@turf/turf';
import { Sheet } from './Sheet';
import { pushSheet, setBounds } from '../redux/reducers/configSlice';
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
  const { t } = useTranslation();
  const features = useSelector((state: RootState) => state.features.features);
  const conf = useSelector((state: RootState) => state.config);
  const id = props.route?.params?.id
    ? parseInt(props.route?.params?.id!)
    : conf.root_screen_id;

  const content = features.find((f) => f.id === id)!;

  const theme = useTheme();
  const mapStyle = useSelector((state: RootState) => state.map.styleStr);
  const tour = useSelector((state: RootState) => state.tour);
  //  const features = useSelector((state: RootState) => state.tour.features);
  const box = content.bbox;

  const cameraRef = useRef<MapboxGL.Camera>();
  const mapRef = useRef<MapboxGL.MapView>();
  // variables
  const snapPoints = useMemo(() => [2 * (height / 3)], []);

  const bounds = useMemo(() => {
    const bo = conf.bounds;

    if (bo) {
      const temp = { sw: [bo[0], bo[1]], ne: [bo[2], bo[3]] };
      return temp;
    } else {
      return { sw: [box[0], box[1]], ne: [box[2], box[3]] };
    }
  }, [conf.bounds]);

  const [paddingBottom, setPaddingBottom] = useState<number>(
    snapPoints[0] + 50,
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
  const handlePushSheetRequest = useCallback(async (idx: number) => {
    const bo = await mapRef.current?.getVisibleBounds()!;
    const bou = [bo[1][0], bo[1][1], bo[0][0], bo[0][1]];
    console.log(bou);
    dispatch(
      pushSheet({
        id: idx,
        bounds: bou,
      }),
    );
  }, []);

  const handleSheetChange = useCallback((index: number) => {
    const pad = snapPoints[index];
    //    setPaddingBottom(pad + 5);
  }, []);

  const mapFeatures = useMemo(() => {
    let poly;
    let line;
    let point;

    for (const f of conf.sheetStack.map((s) =>
      features.find((f) => f.id === s.id),
    )) {
      if (['Polygon', 'MultiPolygon'].includes(f.geometry.type)) {
        poly = difference(
          bboxPolygon([0, 0, 90, 90]),
          feature(f.geometry) as any,
        );
      } else if (['LineString', 'MultiLineString'].includes(f.geometry.type)) {
        line = {
          geometry: f?.geometry,
          type: 'Feature',
          properties: {
            ...(f as any).properties,
            color: 'black',
          },
        };
      } else if (['Point', 'MultiPoint'].includes(f.geometry.type)) {
        point = {
          geometry: f?.geometry,
          type: 'Feature',
          properties: {
            ...(f as any).properties,
            color: 'black',
          },
        };
      }
    }

    console.log('hhhhhhhhh', conf.sheetStack);
    console.log(point);

    const featureCollection = {
      type: 'FeatureCollection',
      features: [poly, line, point].filter((g) => Boolean(g)),
    };

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
  }, [conf.sheetStack, content, tour]);

  return (
    <>
      <BottomSheetModalProvider>
        <ThemedStatusBar barStyle="dark-content" />
        <RN.View
          style={{
            padding: 16,
            shadowRadius: 8,
            // shadowOffset: [5, 5],
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
                styleJSON={mapStyle}
                ref={mapRef as any}
                logoEnabled={false}
                style={{
                  flex: 1,
                  height: 300,
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
                  animationDuration={300}
                  bounds={bounds}
                  padding={conf.padding}
                />
                <MapboxGL.ShapeSource
                  id="mapstory"
                  shape={mapFeatures as any}
                />
              </MapboxGL.MapView>
            )}
            {conf.sheetStack.map((screen) => (
              <Sheet
                handleSheetChange={handleSheetChange}
                snapPoints={snapPoints}
                // onDismiss={() => {}}
                onPush={handlePushSheetRequest}
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
