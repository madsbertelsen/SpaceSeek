import * as React from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-view';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components';

import '../../config/i18n';
import { darkTheme, lightTheme } from '../../config/theme';
import '../../service/initApi';
import { SplashScreen } from '../SplashScreen/SplashScreen';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../Error/ErrorBoundary';
import { useStore, ColorScheme } from '../../hooks/useStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedStatusBar } from '../ThemedStatusBar/ThemedStatusBar';
import { setFeatures } from '../../redux/reducers/featuresSlice';
import { setStyle } from '../../redux/reducers/mapSlice';
import { useDispatch } from 'react-redux';
import { Tabs } from '../../navigators/BottomNavigator';
import { LaunchStackNavigator } from '../../navigators/LaunchStackNavigator';
import { setConfig } from '../../redux/reducers/configSlice';
const axios = require('axios');
const mapStyle = require('./style.json');
//const data = require('./data.json');

const LOADING_TIME_MS = 1200;

export const Main = () => {
  const [loaded, setLoaded] = React.useState(false);
  const rnScheme = useColorScheme();
  const colorScheme = useStore((state) => state.colorScheme);
  const setColorScheme = useStore((state) => state.setColorScheme);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const start = async () => {
      try {
        const data = (await axios.get('http:/192.168.1.150:1337/api/map/style'))
          .data;

        /*
        const data = (
          await axios.get(
            'https://cms.limfjordsruter.mapstory.app/api/map/style',
          )
        ).data;
        */

        dispatch(setFeatures(data.features));
        dispatch(setStyle(mapStyle));
        dispatch(setConfig(data.config));
        //setMapStyle(data.style);
        setLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    start();
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem('theme', (_, result) => {
      if (result === 'dark' || result === 'light') {
        setColorScheme(result);
      } else {
        let newColorScheme: ColorScheme = 'dark';

        if (rnScheme === 'light') {
          newColorScheme = 'light';
        }

        setColorScheme(newColorScheme);
      }
    });
  }, [rnScheme, setColorScheme]);

  if (!loaded) {
    return (
      <ErrorBoundary>
        <ThemeProvider theme={colorScheme === 'light' ? lightTheme : darkTheme}>
          <SplashScreen />
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ThemedStatusBar barStyle="dark-content" />

      <NavigationContainer>
        <ThemeProvider theme={colorScheme === 'light' ? lightTheme : darkTheme}>
          {/* get rid of 'white page flash' by passing initialMetrics */}
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <LaunchStackNavigator />
          </SafeAreaProvider>
        </ThemeProvider>
      </NavigationContainer>
    </ErrorBoundary>
  );
};
