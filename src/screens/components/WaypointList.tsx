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

export const Waypoint = ({ idx }: { idx: number }) => {
  const theme = useTheme();
  const f = useSelector((state: RootState) => state.tour.features[idx]);
  const tour = useSelector((state: RootState) => state.tour);

  return (
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
              tour.focusWaypointIndex === idx ? theme.focusedIconColor : 'white'
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
  );
};
export const WaypointList = ({
  context,
  featureIds,
}: // onFocus,
{
  context: Feature;
  //  onFocus: (arg) => void;
  featureIds: number[];
}) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();
  const features = useSelector((state: RootState) => state.tour.features);

  const itemHeightsRef = useRef([]);
  const offsets = useRef<number[]>([]);

  useEffect(() => {
    setTimeout(() => {
      let acc = -100;
      const sum = itemHeightsRef.current.reduce(
        (prev, current) => prev + current,
        0,
      );

      for (const i of itemHeightsRef.current) {
        acc += i;
        const ratio = 1 - (sum - acc) / sum;
        console.log('i ' + i, 'ratio ', ratio);
        const val = acc - ratio * 200;
        console.log('val ', val);
        offsets.current!.push(val);
      }
    }, 500);
  }, [itemHeightsRef.current]);

  return (
    <>
      <ScrollView
        onLayout={() => console.log('scroll layout')}
        style={{ height: 400 }}
        scrollEventThrottle={16}
        onScroll={(ev) => {
          const offset = ev.nativeEvent.contentOffset.y;

          for (let i = 0; i < offsets.current!.length; i++) {
            let accVal = offsets.current![i];

            if (accVal > offset) {
              console.log(i);
              if (activeIndex !== i) {
                dispatch(setFocusWaypoint({ id: i }));
                setActiveIndex(i);
              }
              break;
            }
          }
        }}>
        {features &&
          features.map((f, idx) => {
            return (
              <RN.View
                onLayout={(ev) => {
                  (itemHeightsRef.current as any)[idx] =
                    ev.nativeEvent.layout.height;
                  console.log('on layout idx ' + idx);
                }}
                key={idx}
                style={{
                  width: width,
                  flex: 1,
                  flexDirection: 'row',
                }}>
                <Svg
                  height={'100%'}
                  style={{
                    marginTop: 50,
                    width: 50,
                    top: 0,
                    left: 0,
                    bottom: 0,
                  }}>
                  <G x={30} y={14}>
                    <Circle
                      x={0}
                      y={0}
                      r={12}
                      stroke={strokeColor}
                      fill={
                        activeIndex === idx ? theme.focusedIconColor : 'white'
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
                  </G>
                  {idx !== 0 && (
                    <Rect
                      x={-10}
                      y={8}
                      height={30}
                      stroke={strokeColor}
                      strokeWidth={2}
                    />
                  )}
                  <Rect
                    x={30}
                    y={24}
                    height={400}
                    stroke={
                      activeIndex > idx ? theme.focusedIconColor : strokeColor
                    }
                    strokeWidth={2}
                  />
                </Svg>
                <RN.View
                  style={{
                    flexGrow: 1,
                    padding: 20,
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RegularText size="l" fontType="bold">
                      {f.name}
                    </RegularText>
                  </RN.View>
                  <RN.Image
                    style={{ height: 120, flexGrow: 2, flex: 2 }}
                    source={{ uri: f.img }}
                  />
                </RN.View>
              </RN.View>
            );
          })}
      </ScrollView>
    </>
  );
};
