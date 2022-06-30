import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LaunchScreen } from '../screens/HomeScreen';
import { bottomRoutes, spaceRoutes } from './routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { ArticleScreen } from '../screens/ArticleScreen';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tabs } from './BottomNavigator';
import { FocusView } from '../screens/FocusView';
import { GeoArticleScreen } from '../screens/GeoArticleScreen';
import { TourArticleScreen } from '../screens/TourArticleScreen';
const featureCollection = require('../screens/limfjorden.json');

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const My = () => {
  return (
    <View
      style={{
        top: 0,
        bottom: 200,
        position: 'absolute',
        height: '100%',
        width: '100%',
      }}>
      <FocusView
        focusFeature={featureCollection.features.find(
          (f) => f.properties.name === 'Limfjorden',
        )}
        contextFeature={featureCollection.features.find(
          (f) => f.properties.name === 'Denmark',
        )}
      />
    </View>
  );
};

export const LaunchStackNavigator = () => {
  const { top } = useSafeAreaInsets();

  return (
    <Stack.Navigator
      initialRouteName={spaceRoutes.tourdetails}
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: '',
        contentStyle: {},
        headerShown: false,
      }}>
      <Stack.Screen name="my-tabs" component={Tabs} />
      <Stack.Screen
        name={bottomRoutes.home}
        component={LaunchScreen}
        options={{
          header: SearchBar,
        }}
      />
      <Stack.Screen
        options={{
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          // headerStatusBarHeight: top || 25,
          headerTransparent: true,
          headerShown: true,
        }}
        name={spaceRoutes.tourdetails}
        component={TourArticleScreen}
      />
      <Stack.Screen
        options={{
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          // headerStatusBarHeight: top || 25,
          headerTransparent: true,
          headerShown: true,
        }}
        name={spaceRoutes.details}
        component={GeoArticleScreen}
      />
      <Stack.Screen name="My" component={My} />
    </Stack.Navigator>
  );
};

/*
const screenOptions: StackNavigationOptions = {
  animationEnabled: true,
  headerBackTitleVisible: false,
  headerTitle: '',
  heder,
};
*/
