import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
//import CacheImage from './CacheImage';

const ImageCollage = ({
  images,
  matrix,
  width = 400,
  height = 400,
  direction = 'row',
  containerStyle,
  onPressImage,
}) => {
  const renderMatrix = () => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sectionDirection = direction === 'row' ? 'column' : 'row';
    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;
      const originImages = images
        .slice(startIndex, startIndex + element)
        .map((image, i) => {
          const source = !Number.isInteger(image)
            ? { uri: image.url }
            : Image.resolveAssetSource(image.url);
          return (
            <TouchableOpacity
              key={i}
              style={styles.touchContainer}
              activeOpacity={0.7}
              onPress={() => onPressImage(source)}>
              <Image source={source} style={styles.image} />
            </TouchableOpacity>
          );
        });

      return (
        <View
          key={m}
          style={[styles.container, { flexDirection: sectionDirection }]}>
          {originImages}
        </View>
      );
    });
  };

  return (
    <View style={[{ width, height }, styles.borderless, containerStyle]}>
      <View style={[styles.matrixContainer, { flexDirection: direction }]}>
        {renderMatrix()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
  },
  touchContainer: {
    flex: 1,
    marginTop: 2,
    marginRight: 2,
  },
  image: { flex: 1, borderRadius: 1 },
  borderless: {
    borderWidth: 0,
  },
  matrixContainer: {
    flex: 1,
  },
});

export default ImageCollage;
