import React, { useEffect, useMemo, useState } from 'react';
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
import { LaunchStatus } from './LaunchStatus';
import { ImageLoadingWrapper } from '../Basic/ImageLoadingWrapper';
import { RocketIcon } from '../SVG/RocketIcon';
import { MapIcon } from '../SVG/MapIcon';
import { SecondSpinner } from '../SpaceList/SecondSpinner';
import Svg, { G, Path, Circle } from 'react-native-svg';
import * as d3 from 'd3';
import { COUNTRIES } from '../../config/config';
import MapboxGL from '@rnmapbox/maps';

const cout = COUNTRIES;
//.filter((c) => c.properties.name.includes('D'));

const IMAGE_SCALE_MAX = 20;
const LABEL_HEADER_MARGIN = 48;

export const LaunchContent = (content: LaunchDetailed) => {
  const [countryList, setCountryList] = useState([]);
  const pan = React.useRef(new RN.Animated.ValueXY()).current;
  const { height, width } = RN.Dimensions.get('screen');
  const mapExtent = useMemo(() => {
    return width > height / 2 ? height / 2 : width;
  }, []);

  const countryPaths = useMemo(() => {
    console.log(cout);

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

  return (
    <BaseScroll
      bounces={false}
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
      {/*
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
        source={{ uri: content.image, priority: 'high' }}
        style={styles.img}
        resizeMode="cover"
      />

          */}
      <Svg width={width} height={height / 2}>
        <G>{countryList.map((x) => x)}</G>
      </Svg>
      <RN.Animated.View
        style={{
          paddingHorizontal: 16,
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
        <RegularText size="xxl" fontType="bold">
          {content.name}
        </RegularText>
        <RocketContent {...content} />
        <LaunchServiceProviderContent {...content} />
        <MissionContent {...content} />
        <PadContent {...content} />
        <VideoContent {...content} />
      </RN.Animated.View>
    </BaseScroll>
  );
};

const VideoContent = (content: LaunchDetailed) => {
  const { t } = useTranslation();

  if (!content.vidURLs?.length) {
    return null;
  }

  return (
    <S.ContentSection>
      <T.SectionTitle text={t('Stream')} />

      <RN.View style={{ flexDirection: 'column' }}>
        {content.vidURLs.map((item) => (
          <VideoContentItem {...item} />
        ))}
      </RN.View>
    </S.ContentSection>
  );
};

const RocketContent = (content: LaunchDetailed) => {
  const { t } = useTranslation();

  if (!content.rocket || !content.rocket.configuration) {
    return null;
  }

  return (
    <S.ContentSection>
      <T.SectionTitle text={t('Rocket')} />

      <T.ContentTitle text={content.rocket?.configuration?.full_name} />

      <T.Description text={content.rocket?.configuration?.description} />

      <BadgeWrapper type="wiki" url={content.rocket?.configuration?.wiki_url} />
    </S.ContentSection>
  );
};

export const LaunchServiceProviderContent = (content: LaunchDetailed) => {
  const { t } = useTranslation();

  let text = content.launch_service_provider?.administrator;

  if (text?.length && content.launch_service_provider?.type?.length) {
    text += '| ';
    text += content.launch_service_provider?.type;
  }

  if (!content.launch_service_provider) {
    return null;
  }

  return (
    <S.ContentSection>
      <T.SectionTitle text={t('Provider')} />

      <T.ContentTitle text={content.launch_service_provider?.name} />

      <T.Description text={text} />

      <T.Description text={content.launch_service_provider?.description} />
      <MapboxGL.MapView
        //styleURL={style}
        styleJSON={JSON.stringify(mapStyle)}
        logoEnabled={false}
        style={{ flex: 1, height: 200 }}>
        <MapboxGL.UserLocation />
        <MapboxGL.Camera
          defaultSettings={{
            animationMode: 'flyTo',
            animationDuration: 10,
            padding: {
              paddingBottom: 200,
              paddingLeft: 50,
              paddingRight: 50,
              paddingTop: 50,
            },
            bounds: {
              ne: [8.6656779, 56.5821725],
              sw: [8.6122483, 56.5146583],
            },
          }}
          centerCoordinate={experience.geometry.coordinates}
          zoomLevel={12}
          padding={{
            paddingBottom: 200,
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 50,
          }}
        />
        <MapboxGL.ShapeSource
          id="mapstory"
          shape={{
            type: 'FeatureCollection',
            features: [{ type: 'Feature', ...experience }],
          }}
        />
      </MapboxGL.MapView>
      <BadgeWrapper
        type="wiki"
        url={content.launch_service_provider?.wiki_url}
      />
    </S.ContentSection>
  );
};

export const MissionContent = (content: LaunchDetailed) => {
  const { t } = useTranslation();

  let text = content.mission?.type;

  if (text?.length && content.mission?.orbit?.name?.length) {
    text += '| ';
    text += content.mission?.orbit.name;
  }

  if (!content.mission) {
    return null;
  }

  return (
    <S.ContentSection>
      <T.SectionTitle text={t('Mission')} />

      <T.ContentTitle text={content.mission?.name} />

      <T.Description text={text} />

      <T.Description text={content.mission?.description} />
    </S.ContentSection>
  );
};

export const PadContent = (content: LaunchDetailed) => {
  const { t } = useTranslation();
  const { openLaunchPad } = useLaunchPad(content);

  if (!content.pad) {
    return null;
  }

  return (
    <S.ContentSection>
      <T.SectionTitle text={t('Pad')} />

      <T.ContentTitle text={content.pad?.name} />

      <T.Description text={content.pad?.location.name} />

      <BadgeWrapper type="wiki" url={content.pad?.wiki_url} />

      <BadgeWrapper type="launch" onPress={openLaunchPad} />

      <PadMapImage {...content} />
    </S.ContentSection>
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
