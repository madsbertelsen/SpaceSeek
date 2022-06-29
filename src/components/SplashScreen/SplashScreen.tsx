import React from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { G } from 'react-native-svg';
import { Title } from '../Basic/Basic';
import { SecondSpinner } from '../SpaceList/SecondSpinner';
import { DenmarkIcon } from '../SVG/Denmark';
import { MapIcon } from '../SVG/MapIcon';
import * as S from './SplashScreen.styled';

const { height, width } = Dimensions.get('screen');

export const SplashScreen = () => {
  return (
    <S.StyledSplashScreen>
      <View style={{ position: 'relative' }} />
      <DenmarkIcon width={width} height={height} fill="white" />
    </S.StyledSplashScreen>
  );
};
