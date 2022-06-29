import React from 'react';
import * as RN from 'react-native';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

import { Title } from '../components/Basic/Basic';
import { BlurView } from '@react-native-community/blur';
import { CollectionContent } from '../components/LaunchContent/CollectionContent';
import { ThemedStatusBar } from '../components/ThemedStatusBar/ThemedStatusBar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { TourContent } from '../components/LaunchContent/TourContent';

export interface DetailsScreenIncomeParamsProps {
  id?: string;
}

export interface DetailsScreenProps {
  route?: {
    params?: DetailsScreenIncomeParamsProps;
  };
}

export const ArticleScreen = (props: DetailsScreenProps) => {
  const [error, setError] = React.useState(false);
  const { t } = useTranslation();
  const id = parseInt(props.route?.params?.id!);
  // const feature = useSelector((state: RootState) => state.features.features[0]);
  const features = useSelector((state: RootState) => state.features.features);
  const feature = features.find((f) => f.id === id)!;

  React.useEffect(() => {
    const t = setTimeout(() => {
      /*
      const objs = require('../mockData/launches.json');
      setData(features.find((f) => f.id.toString() === id)!);
      */
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  if (!feature) {
    return (
      <>
        <BlurView style={[styles.img]} />
        <ActivityIndicator style={{ marginTop: 16 }} />
      </>
    );
  }

  return (
    <>
      <ThemedStatusBar barStyle="dark-content" />

      {!feature && error && <Title>{t('errorText')}</Title>}
      {!feature || error ? (
        <ActivityIndicator />
      ) : (
        <CollectionContent {...feature!} />
      )}
    </>
  );
};

const styles = RN.StyleSheet.create({
  img: {
    backgroundColor: '#ccc',
    width: '100%',
    height: '40%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  padImg: {
    marginVertical: 16,
    width: '80%',
    height: 160,
    alignSelf: 'center',
    borderRadius: 8,
  },
  wiki: {
    paddingHorizontal: 2,
    paddingVertical: 4,
    backgroundColor: 'red',
  },
  videoItem: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 },
  },
});
