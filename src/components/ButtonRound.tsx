/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, Platform } from 'react-native';

export default ({
  fontSize,
  children,
}: {
  fontSize: number;
  children: any;
}) => {
  const size = 25;
  const borderWidth = 0;
  const color = 'black';
  const backgroundColor = 'black';
  return (
    <View
      style={{
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: color,
        width: size,
        height: size,
        borderRadius: size,
        borderWidth: borderWidth,
      }}>
      <Text
        style={{
          textAlign: 'center',
          backgroundColor: 'none',
          fontSize: fontSize - 2 * borderWidth,
          lineHeight:
            fontSize - (Platform.OS === 'ios' ? 2 * borderWidth : borderWidth),
        }}>
        {children}
      </Text>
    </View>
  );
};
