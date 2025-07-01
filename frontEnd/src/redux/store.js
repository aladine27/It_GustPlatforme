import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import employeReducer from './slices/employeSlice'; 
import documentReducer from './slices/documentSlice';
import { eventSlice, eventTypeSlice } from './slices/eventSlice';
import {persistReducer} from 'redux-persist'
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { leaveSlice, leaveTypeSlice } from './slices/leaveSlice';


const rootReducer = combineReducers({
    user:userReducer,
    employe:employeReducer,
    event: eventSlice.reducer,
    eventType: eventTypeSlice.reducer,
    leave:leaveSlice.reducer,
    leaveType:leaveTypeSlice.reducer,
    document: documentReducer
    
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