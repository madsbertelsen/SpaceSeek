import featuresReducer from './reducers/featuresSlice';
import mapStyle from './reducers/mapStyle';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
//import storage from 'redux-persist/lib/storage';
import storage from '@react-native-async-storage/async-storage';

const reducer = combineReducers({
  mapStyle,
});

const persistConfig = {
  key: 'root',
  storage, //: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore(
  {
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  },
  //composeEnhancers(applyMiddleware(thunk, firebase)),
);
let persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export { persistor, store };
