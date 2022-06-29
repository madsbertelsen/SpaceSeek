import React, {useState, useEffect} from 'react';
import {Image, Platform} from 'react-native';
let RNFS = require('react-native-fs');
import shorthash from 'shorthash';
import ImageLoader from './ImageLoader';

const CacheImage = ({source, blurhash, style, resizeMode}) => {
  const [imgSource, setImgSource] = useState(null);

  useEffect(() => {
    const name = shorthash.unique(source.uri);
    const extension = Platform.OS === 'android' ? 'file://' : '';
    const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
    RNFS.exists(path).then(exists => {
      if (exists) {
        setImgSource({uri: path});
      } else {
        downloadFile(source.uri, path);
      }
    });
  }, [source]);

  const downloadFile = (uri, path) => {
    RNFS.downloadFile({
      fromUrl: encodeURI(uri),
      toFile: path,
    }).promise.then(res => setImgSource({uri: path}));
  };

  return (
    <>
      {imgSource === null ? (
        <ImageLoader
          blurhash={blurhash}
          height={style && style.height ? style.height : 100}
          borderRadius={style && style.borderRadius ? style.borderRadius : 8}
        />
      ) : (
        <Image
          resizeMode={resizeMode || 'cover'}
          style={style}
          source={imgSource}
        />
      )}
    </>
  );
};

export default CacheImage;
