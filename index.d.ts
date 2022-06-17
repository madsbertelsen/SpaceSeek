declare module '*.png' {
  const content: ImageSourcePropType;
  export default content;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
interface Photo {
  url: string;
}

interface Properties {
  color: string;
}

interface Feature {
  type: 'Feature';
  name: string;
  id: number;
  description: string;
  photos: Photo[];
}
