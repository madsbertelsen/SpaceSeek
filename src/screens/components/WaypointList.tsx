import { RegularText } from '../../components/Basic/Basic';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as RN from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Svg, { Circle, G, Rect, Text, TSpan } from 'react-native-svg';
import { sortWaypoints } from '../../utils';
import { ScrollView } from 'react-native-gesture-handler';
import { setFocusWaypoint } from '../../redux/reducers/tourSlice';
import { useTheme } from 'styled-components';
export interface DetailsScreenIncomeParamsProps {
  id?: string;
}
const strokeColor = 'black';
const { height, width } = RN.Dimensions.get('screen');

export const Waypoint = ({
  idx,
  onPress,
}: {
  idx: number;
  onPress: () => void;
}) => {
  const theme = useTheme();
  const f = useSelector((state: RootState) => state.tour.features[idx]);
  const tour = useSelector((state: RootState) => state.tour);

  return (
    <RN.Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? 'rgb(210, 230, 255)' : undefined,
        },
      ]}>
      <RN.View
        style={{
          width: width,
          flex: 1,
          flexDirection: 'row',
        }}>
        <Svg
          height={'100%'}
          style={{
            marginTop: 30,
            width: 70,
            top: 0,
            left: 0,
            bottom: 0,
          }}>
          <G x={50} y={14}>
            <Circle
              x={0}
              y={0}
              r={12}
              stroke={strokeColor}
              fill={
                tour.focusWaypointIndex === idx
                  ? theme.focusedIconColor
                  : 'white'
              }
              strokeWidth={2}
              onPress={() => {}}
            />
            <Text
              fontSize={12}
              fontWeight="bold"
              //verticalAlign={20}
              alignmentBaseline="center"
              textAnchor="middle"
              fill={strokeColor}
              y={-3}
              x={0}>
              {f.symbol}
            </Text>
            <Rect
              x={0}
              y={12}
              height={400}
              stroke={
                tour.focusWaypointIndex > idx
                  ? theme.focusedIconColor
                  : strokeColor
              }
              //stroke={theme.focusedIconColor}
              strokeWidth={tour.focusWaypointIndex > idx ? 4 : 2}
            />
          </G>
        </Svg>
        <RN.View
          style={{
            flexGrow: 1,
            padding: 20,
            paddingLeft: 0,
            flexDirection: 'row',
          }}>
          <RN.View
            style={{
              flexGrow: 1,
              padding: 50,
              paddingLeft: 0,
              flexDirection: 'row',
            }}>
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
            <RN.Image
              style={{
                height: 120,
                width: '100%',
                position: 'absolute',
                flex: 2,
              }}
              source={{ uri: f.img }}
            />
          </RN.View>
        </RN.View>
      </RN.View>
    </RN.Pressable>
  );
};
