import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import employeReducer from './slices/employeSlice';   // ← Ajoute cet import
import {persistReducer} from 'redux-persist'
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const rootReducer = combineReducers({
    user:userReducer,
    employe:employeReducer
});
const persistConfig={
    key:'root',
    storage,
    version:1
}
const persistedReducer = persistReducer(persistConfig,rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
});
export const persistor = persistStore(store);