import { combineReducers, configureStore } from '@reduxjs/toolkit';
import uiReducer from '@states/uiSlice';
import toastReducer from '@states/toastSlice';
import variablesReducer from '@states/variablesSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import restClientReducer from '@states/restClientSlice';

const rootReducer = combineReducers({
  ui: uiReducer,
  toast: toastReducer,
  variables: variablesReducer,
  restClient: restClientReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['variables', 'restClient'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;
