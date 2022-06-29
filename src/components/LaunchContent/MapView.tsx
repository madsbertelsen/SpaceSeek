import React, { useCallback, useMemo, useRef } from 'react';
import * as RN from 'react-native';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';

import MapboxGL from '@rnmapbox/maps';
import { RootState } from '../../redux/store';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useTheme } from 'styled-components';
import { SpaceListItem } from '../SpaceList/SpaceListItem';
import { Spinner } from '../SpaceList/Spinner';
import { feature } from 'topojson-client';

export const MapView = (content: Feature & { marginHorizontal: number }) => {
  const theme = useTheme();
  const mapStyle = useSelector((state: RootState) => state.map.style);
  const bbox = content.bbox;
  const bounds = { sw: [bbox[0], bbox[1]], ne: [bbox[2], bbox[3]] };
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '75%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <RN.View style={styles.container}>
      <MapboxGL.MapView
        //styleURL={style}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
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
            animationDuration: 10,
            bounds,
          }}
          //   centerCoordinate={content.geometry.coordinates}
          //       zoomLevel={10}
          padding={{
            paddingBottom: 50,
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
      {/*
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetFlatList
          onEndReachedThreshold={0.5}
          // scrollEventThrottle={16}
          style={{ flex: 1, width: '100%' }}
          data={content.relations as any}
          showsVerticalScrollIndicator={false}
          //    keyExtractor={(item) => item.id || '1'}
          ListEmptyComponent={Spinner}
          renderItem={(item: any) => <RN.Text>{item.item.id}</RN.Text>}
        />
      </BottomSheet>
      */}
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
