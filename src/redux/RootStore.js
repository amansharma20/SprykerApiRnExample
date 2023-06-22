import {configureStore} from '@reduxjs/toolkit';
import getCustomerDetailsApiSlice from './profileApi/ProfileApiSlice';
import getCustomerCartItemsAliSlice from './CartApi/CartApiSlice';
import getCheckoutDataApiSlice from './checkoutDataApi/CheckoutApiSlice';
import {combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import customerCartIdApiSlice from './customerCartIdApi/CustomerCartIdApiSlice';
const allReducers = combineReducers({
  getCustomerDetailsApiSlice,
  getCustomerCartItemsAliSlice,
  getCheckoutDataApiSlice,
  customerCartIdApiSlice,
});

const store = configureStore({
  reducer: allReducers,
  middleware: [thunkMiddleware],
});

export default store;
