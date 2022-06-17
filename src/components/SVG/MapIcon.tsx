import React from 'react';
import Animated from 'react-native-reanimated';
import { useTheme } from 'styled-components';
import _SVG from '../../assets/svg/map.svg';
import {
  defaultSVGProps,
  SVGWrapperProps,
  transformSVGProps,
} from './svgProps';

class SVG extends React.Component {
  render() {
    return <_SVG {...this.props} />;
  }
}

const Anim = Animated.createAnimatedComponent(SVG);

export const MapIcon = (props: SVGWrapperProps) => {
  const theme = useTheme();

  return (
    <Anim
      {...{
        fill: theme.fontColors.regular,
        ...transformSVGProps({ ...defaultSVGProps, ...props }),
      }}
    />
  );
};
