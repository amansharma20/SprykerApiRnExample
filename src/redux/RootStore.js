import {configureStore} from '@reduxjs/toolkit';
import getCustomerDetailsApiSlice from './profileApi/ProfileApiSlice';
import {combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

const allReducers = combineReducers({
  getCustomerDetailsApiSlice,
});

const store = configureStore({
  reducer: allReducers,
  middleware: [thunkMiddleware],
});

export default store;
