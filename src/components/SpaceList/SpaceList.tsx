import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { SpaceListItem } from './SpaceListItem';
import { Spinner } from './Spinner';
import { MapView } from '../LaunchContent/MapView';
import MapboxGL from '@rnmapbox/maps';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
const featureCollection = require('./limfjorden.json');
const turf = require('@turf/turf');

interface Props {
  onEndReached: () => void;
  data: any[];
}
export const SpaceList = (props: Props) => {
  const mapStyle = useSelector((state: RootState) => state.map.style);

  const bbox = turf.bbox(featureCollection);

  const bounds = { sw: [bbox[0], bbox[1]], ne: [bbox[2], bbox[3]] };
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '75%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        //styleURL={style}

        styleJSON={JSON.stringify(mapStyle)}
        logoEnabled={false}
        style={{
          flex: 1,
          height: 300,
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
          padding={{
            paddingBottom: 50,
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 50,
          }}
        />
        <MapboxGL.ShapeSource id="mapstory" shape={featureCollection} />
      </MapboxGL.MapView>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetFlatList
          onEndReachedThreshold={0.5}
          // scrollEventThrottle={16}
          onEndReached={props.onEndReached}
          style={{ flex: 1, width: '100%' }}
          data={props.data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id || '1'}
          ListEmptyComponent={Spinner}
          renderItem={(item) => <SpaceListItem {...item.item} />}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

/*
import React from 'react';
import * as RN from 'react-native';
import Svg from 'react-native-svg';
import { LaunchSerializerCommon } from '../../service/service';
import { DenmarkIcon } from '../SVG/Denmark';

import { SpaceListItem } from './SpaceListItem';
import { Spinner } from './Spinner';

interface Props {
  onEndReached: () => void;
  data: LaunchSerializerCommon[] | null;
}

const { height, width } = RN.Dimensions.get('screen');

export const SpaceList = (props: Props) => {
  return (
    <RN.FlatList
      onEndReachedThreshold={0.5}
      // scrollEventThrottle={16}
      onEndReached={props.onEndReached}
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{ paddingTop: 16 }}
      data={props.data}
      numColumns={dw > 700 ? 2 : 1}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id || '1'}
      ListEmptyComponent={Spinner}
      renderItem={(item) => <SpaceListItem {...item.item} />}
    />
  );
};
*/
