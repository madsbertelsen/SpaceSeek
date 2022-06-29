import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as RN from 'react-native';
import { useTranslation } from 'react-i18next';

import { LaunchDetailed } from '../../service/service';
import { BadgeWrapper } from '../Badges/BadgeWrapper';
import { BaseScroll, RegularText, Title } from '../Basic/Basic';
import * as S from './LaunchContent.styled';
import * as T from './LaunchContentText';
import { PadMapImage } from './PadMapImage';
import { VideoContentItem } from './VideoContentItem';
import { useLaunchPad } from '../../hooks/useLaunchPad';
import { useSelector } from 'react-redux';

import Svg, { G, Path, Circle } from 'react-native-svg';
import * as d3 from 'd3';
import { COUNTRIES } from '../../config/config';
import MapboxGL from '@rnmapbox/maps';
import { useStore } from '../../hooks/useStore';
import { RootState } from '../../redux/store';
import { ImageLoadingWrapper } from '../Basic/ImageLoadingWrapper';
import ReadMore from 'react-native-read-more-text';
import { useNavigation } from '@react-navigation/native';
import { MapView } from './MapView';
import ButtonRound from '../ButtonRound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import { spaceRoutes } from '../../navigators/routes';

const cout = COUNTRIES;
//.filter((c) => c.properties.name.includes('D'));

const IMAGE_SCALE_MAX = 20;
const LABEL_HEADER_MARGIN = 48;

export const CollectionContent = (content: Feature) => {
  const navigation = useNavigation();
  const [countryList, setCountryList] = useState([]);
  const pan = React.useRef(new RN.Animated.ValueXY()).current;
  const mapStyle = useSelector((state: RootState) => state.map.style);
  const bbox = content.bbox;
  const bounds = { sw: [bbox[0], bbox[1]], ne: [bbox[2], bbox[3]] };
  const { t } = useTranslation();

  const features = useSelector((state: RootState) => state.features.features);
  const childIds = content.relations[0].features.map((f) => f.id);

  const children = features.filter((f) => childIds.includes(f.id));

  const renderTruncatedFooter = (handlePress) => {
    return <RN.Text onPress={handlePress}>Read more</RN.Text>;
  };

  const renderRevealedFooter = (handlePress) => {
    return <RN.Text onPress={handlePress}>Show less</RN.Text>;
  };

  const handleTextReady = () => {
    // ...
  };

  const headerOpacity = pan.y.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const { height, width } = RN.Dimensions.get('screen');
  const mapExtent = useMemo(() => {
    return width > height / 2 ? height / 2 : width;
  }, []);

  /*
  const countryPaths = useMemo(() => {
    const projection = d3
      .geoMercator()
      .scale(5000)
      // Center the Map to middle of shown area
      .center([9.0, 56.7])
      .translate([width / 2, mapExtent / 2]);
    const geoPath = d3.geoPath().projection(projection);
    const svgPaths = cout.map(geoPath);
    return svgPaths;
  }, [cout]);

  useEffect(() => {
    setCountryList(
      countryPaths.map((path: any, i: any) => {
        return (
          <Path
            key={cout[i].properties.name}
            d={path}
            stroke={'#000'}
            strokeOpacity={0.9}
            strokeWidth={2.6}
            fill={'#aaa'}
            opacity={0.4}
          />
        );
      }),
    );
  }, []);
  */
  useEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <RN.Animated.View
          style={{
            backgroundColor: 'white',
            ...RN.StyleSheet.absoluteFillObject,
            opacity: headerOpacity,
          }}
        />
      ),
      headerTransparent: true,
    });
  }, [headerOpacity, navigation]);

  return (
    <BaseScroll
      contentContainerStyle={{ padding: 0 }}
      onScroll={RN.Animated.event(
        [{ nativeEvent: { contentOffset: { y: pan.y } } }],
        {
          useNativeDriver: false,
        },
      )}
      alwaysBounceVertical={false}
      contentInsetAdjustmentBehavior="never"
      scrollEventThrottle={1}>
      <ImageLoadingWrapper
        animStyle={{
          transform: [
            {
              translateY: pan.y.interpolate({
                inputRange: [-1000, 0],
                outputRange: [-100, 0],
                extrapolate: 'clamp',
              }),
            },
            {
              scale: pan.y.interpolate({
                inputRange: [-3000, 0],
                outputRange: [IMAGE_SCALE_MAX, 1],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
        source={{ uri: content.img, priority: 'high' }}
        style={styles.img}
        resizeMode="cover"
      />

      {/*

  */}
      <RN.Animated.View
        style={{
          paddingHorizontal: 16,
          backgroundColor: '#fff',
          transform: [
            {
              translateY: pan.y.interpolate({
                inputRange: [-1000, 0],
                outputRange: [LABEL_HEADER_MARGIN * IMAGE_SCALE_MAX, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}>
        <RN.View>
          <RegularText size="xxl" fontType="bold">
            {content.name}
          </RegularText>

          <ReadMore
            numberOfLines={3}
            renderTruncatedFooter={renderTruncatedFooter}
            renderRevealedFooter={renderRevealedFooter}
            onReady={handleTextReady}>
            <RegularText size="l" fontType="regular">
              {content.description}
            </RegularText>
          </ReadMore>
        </RN.View>
        {/*

        <RegularText size="xxl" fontType="bold">
          {content.name}
        </RegularText>
        <MapView {...content} marginHorizontal={-16} />
          */}
        {content.relations.map((rel) => {
          return (
            <>
              <RegularText size="xxl" fontType="bold">
                {rel.name}
              </RegularText>
              {rel.features.map((f) => {
                return (
                  <>
                    <RN.View style={{ paddingVertical: 24 }}>
                      <TourContent
                        {...features.find((fa) => fa.id === f.id)!}
                      />
                    </RN.View>
                    <RN.View
                      style={{
                        height: 8,
                        flex: 1,
                        marginHorizontal: -16,
                      }}
                    />
                  </>
                );
              })}
            </>
          );
        })}
      </RN.Animated.View>
    </BaseScroll>
  );
};
const TourContent = (content: Feature) => {
  const nav = useNavigation();
  return (
    <RN.Pressable
      onPress={() => {
        (nav as any).push(spaceRoutes.tourdetails, { id: content.id });
      }}>
      <RN.View
        style={{
          padding: 16,
          backgroundColor: 'white',
          shadowRadius: 8,
          shadowOffset: [5, 5],
          shadowOpacity: 0.3,
          shadowColor: 'black',
          borderRadius: 8,
        }}>
        <MapView {...content} marginHorizontal={0} />
        <RN.View style={{ flexDirection: 'row', paddingVertical: 16 }}>
          <ButtonRound fontSize={25}>
            <Icon
              name="directions-walk"
              color="white"
              style={{ fontSize: 20 }}
            />
          </ButtonRound>

          <RegularText style={{ marginLeft: 16 }} size="xl" fontType="bold">
            {content.name}
          </RegularText>
        </RN.View>

        <RN.View style={{ flexDirection: 'row' }}>
          <RN.View style={{ flexDirection: 'row' }}>
            <RegularText size="l" fontType="bold">
              <Octicon
                name="arrow-both"
                color="black"
                style={{ fontSize: 16 }}
              />
              {'  13,4 km'}
            </RegularText>
          </RN.View>

          <RN.View style={{ flexDirection: 'row', marginLeft: 20 }}>
            <RegularText style={{ marginLeft: 10 }} size="l" fontType="bold">
              <Octicon
                name="clock"
                color="black"
                style={{ fontSize: 16, padding: 20 }}
              />
              {'  2 t 17'}
            </RegularText>
          </RN.View>
        </RN.View>
      </RN.View>
    </RN.Pressable>
  );
};

const styles = RN.StyleSheet.create({
  img: {
    backgroundColor: '#ccc',
    width: '100%',
    height: 350,
    justifyContent: 'flex-end',
    padding: 0,
  },
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 },
  },
});
