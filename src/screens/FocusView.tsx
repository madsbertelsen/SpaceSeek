import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  useAnimatedProps,
} from 'react-native-reanimated';
import { View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Svg, { G, Path, Rect } from 'react-native-svg';
import * as d3 from 'd3';

const turf = require('@turf/turf');

//import featureCollection from './limfjorden.json';

import { StyleSheet } from 'react-native';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedG = Animated.createAnimatedComponent(G);

const Inner = (props: {
  contextFeature: Feature;
  focusFeature: Feature;
  height: number;
  width: number;
}) => {
  const { height, width } = props;
  const randomWidth = useSharedValue(100);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const topPadding = useSharedValue(0);
  const rightPadding = useSharedValue(0);
  const leftPadding = useSharedValue(0);
  const bottomPadding = useSharedValue(0);
  const scale = useSharedValue(1);
  const gTranslateX = useSharedValue(0);
  const gTranslateY = useSharedValue(0);

  const projection = useMemo(() => {
    const bbox = turf.bbox(props.contextFeature);
    console.log(bbox);
    // const poly = turf.bboxPolygon(bbox);
    //const buf = turf.buffer(poly, 50, { units: 'kilometers' });

    return d3.geoMercator().fitSize([width, height], {
      type: 'FeatureCollection',
      features: [props.contextFeature],
    });
  }, [height, width, props.contextFeature]);

  const geoGenerator = useMemo(() => {
    if (!projection) {
      return;
    }
    const geoPath = d3.geoPath().projection(projection);
    return geoPath;
  }, [projection]);

  const contextPath = useMemo(() => {
    if (!geoGenerator) {
      return;
    }
    return geoGenerator(props.contextFeature);
  }, [geoGenerator, props.contextFeature]);

  /*
  const detailPath = useMemo(() => {
    var bbox = turf.bbox(props.contextFeature);
    return geoGenerator(props.focusFeature);
  }, [geoGenerator]);
  */

  const duration = 1000;

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  const gProps = useAnimatedProps(() => {
    return {
      translate: [
        withTiming(gTranslateX.value, { duration: duration }),
        withTiming(gTranslateY.value, { duration: duration }),
      ],
      scale: withTiming(scale.value, { duration: duration }),
    };
  });

  const topProps = useAnimatedProps(() => {
    return {
      height: withTiming(topPadding.value, { duration: duration }),
    };
  });
  const bottomProps = useAnimatedProps(() => {
    return {
      height: withTiming(bottomPadding.value, { duration: duration }),
    };
  });

  const rightProps = useAnimatedProps(() => {
    return {
      width: withTiming(rightPadding.value, { duration: duration }),
    };
  });

  const leftProps = useAnimatedProps(() => {
    return {
      width: withTiming(leftPadding.value, { duration: duration }),
    };
  });

  useEffect(() => {
    if (!geoGenerator) {
      return;
    }

    const bbox = turf.bbox({
      type: 'FeatureCollection',
      features: [props.focusFeature],
    });

    const iSw = projection([bbox[0], bbox[1]]);
    const iNe = projection([bbox[2], bbox[3]]);
    const iDistX = iNe[0] - iSw[0];
    const iDistY = iNe[1] - iSw[1];

    x.value = iSw[0];
    y.value = iSw[1] + iDistY;
    topPadding.value = iNe[1];
    rightPadding.value = -(width - iNe[0]);
    leftPadding.value = iSw[0];
    bottomPadding.value = -(height - iSw[1]);

    const ratio = width / iDistX;
    setTimeout(() => {
      gTranslateX.value = -iSw[0] * ratio;
      gTranslateY.value = -iNe[1] * ratio;
      scale.value = ratio;
    }, duration);
  }, [geoGenerator, projection, height, width]);
  const opacity = 0.7;
  const fill = 'black';

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      viewBox={'0 0 ' + width + ' ' + height}>
      <AnimatedG animatedProps={gProps}>
        {contextPath && (
          <Path
            d={contextPath}
            //   stroke={'#000'}
            strokeOpacity={0.9}
            strokeWidth={2.6}
            fill={'#ddd5ca'}
          />
        )}
        {/*
        detailPath && <Path d={detailPath} fill={'#495f4c'} opacity={1} />
          */}
        <AnimatedRect
          animatedProps={topProps}
          width={width}
          height={0}
          opacity={opacity}
          fill={fill}
        />
        <AnimatedRect
          animatedProps={bottomProps}
          y={height}
          width={width}
          fill={fill}
          opacity={opacity}
        />
        <AnimatedRect
          animatedProps={rightProps}
          x={width}
          height={height}
          fill={fill}
          opacity={opacity}
        />
        <AnimatedRect
          animatedProps={leftProps}
          x={0}
          height={height}
          fill={fill}
          opacity={opacity}
        />
      </AnimatedG>
    </Svg>
  );
};

export const FocusView = (props: {
  contextFeature: Feature;
  focusFeature: Feature;
}) => {
  const [viewSize, setViewSize] = useState<any>();
  return (
    <View
      style={{ height: '100%' }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setViewSize({ width, height });
      }}>
      {viewSize && (
        <Inner
          contextFeature={props.contextFeature}
          focusFeature={props.focusFeature}
          width={viewSize.width}
          height={viewSize.height}
        />
      )}
    </View>
  );
};
