/**
 * @format
 */

if (process.env.NODE_ENV !== 'production') {
  const { connectToDevTools } = require('react-devtools-core');

  // Must be called before packages like react or react-native are imported
  connectToDevTools({});
}
import * as React from 'react';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Main } from './src/components/Main/Main';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';

const go = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => go);
