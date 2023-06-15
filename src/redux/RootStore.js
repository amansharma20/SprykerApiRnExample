import {configureStore} from '@reduxjs/toolkit';
import getCustomerDetailsApiSlice from './profileApi/ProfileApiSlice';
import getCustomerCartItemsAliSlice from './CartApi/CartApiSlice';
import {combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

const allReducers = combineReducers({
  getCustomerDetailsApiSlice,
  getCustomerCartItemsAliSlice,
});

const store = configureStore({
  reducer: allReducers,
  middleware: [thunkMiddleware],
});

export default store;
