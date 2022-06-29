import { RegularText } from '../components/Basic/Basic';
import React from 'react';
import * as RN from 'react-native';
import ReadMore from 'react-native-read-more-text';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Svg, { Circle, Rect } from 'react-native-svg';
export interface DetailsScreenIncomeParamsProps {
  id?: string;
}

export interface DetailsScreenProps {
  route?: {
    params?: DetailsScreenIncomeParamsProps;
  };
}
const { height, width } = RN.Dimensions.get('screen');

interface Props {
  items: { id: number; name: string; img: string }[];
}

export const WaypointSlider = ({ items }: Props) => {
  const strokeColor = 'black';

  return (
    <RN.View style={{ width: '100%', backgroundColor: '#f3f0ef' }}>
      <RN.View style={{ padding: 20 }}>
        <RegularText size="xxl" fontType="bold">
          Langs ruten
        </RegularText>
      </RN.View>
      <RN.ScrollView
        onScroll={(ev) => {
          console.log(ev.nativeEvent.contentOffset.x);
        }}
        horizontal>
        {items.map((f, idx) => {
          return (
            <RN.View style={{ width: width, flex: 1, flexDirection: 'row' }}>
              <Svg
                height={30}
                width={width}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  left: 0,
                  height: 30,
                }}>
                <Circle
                  x={26}
                  y={10}
                  r={6}
                  stroke={strokeColor}
                  strokeWidth={2}
                />
                {idx !== 0 && (
                  <Rect
                    x={-10}
                    y={10}
                    width={30}
                    stroke={strokeColor}
                    strokeWidth={2}
                  />
                )}
                <Rect
                  x={32}
                  y={10}
                  width={width}
                  stroke={strokeColor}
                  strokeWidth={2}
                />
              </Svg>
              <RN.View
                style={{
                  padding: 20,
                  width: '100%',
                  flexDirection: 'row',
                }}>
                <RN.View style={{ flex: 1 }}>
                  <RegularText size="l" fontType="bold">
                    {f.name}
                  </RegularText>
                </RN.View>
                <RN.Image
                  style={{ height: 120, flex: 1 }}
                  source={{ uri: f.img }}
                />
              </RN.View>
            </RN.View>
          );
        })}
      </RN.ScrollView>
    </RN.View>
  );
};
