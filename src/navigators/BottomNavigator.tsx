import * as React from 'react';
import {
  BottomTabBarOptions,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { MapScreen } from '../screens/MapScreen';
import { bottomRoutes } from './routes';
import { NavBarIcon } from '../components/NavBarIcon/NavBarIcon';
import { LaunchStackNavigator } from './LaunchStackNavigator';
import { NavBarLabel } from '../components/NavBarLabel/NavBarLabel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from 'styled-components';
import { LaunchScreen } from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

export const Tabs = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ _route }: any) => {
        return {
          tabBarIcon: NavBarIcon,
          tabBarLabel: NavBarLabel,
          tabBarStyle: {
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundColor: theme.headerBackgroundColor,
          },
        };
      }}
      /*
      tabBarOptions={{
        ...tabBarOptions,
        tabStyle: {
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: theme.headerBackgroundColor,
        },
        style: {
          backgroundColor: theme.headerBackgroundColor,
          height: 70 + insets.bottom,
          paddingTop: 6,
          paddingBottom: 8 + insets.bottom,
        },
      }}
      */
      initialRouteName={bottomRoutes.home}>
      {/* <Tab.Screen name={bottomRoutes.home} component={SpaceStackNavigator} /> */}
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarTestID: 'launches-route-btn',
        }}
        name={bottomRoutes.home}
        component={LaunchScreen}
      />

      <Tab.Screen
        options={{ tabBarTestID: 'map-route-btn' }}
        name={bottomRoutes.search}
        component={MapScreen}
      />

      <Tab.Screen
        options={{ tabBarTestID: 'settings-route-btn' }}
        name={bottomRoutes.settings}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};
