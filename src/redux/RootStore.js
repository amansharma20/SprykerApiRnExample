import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import getCustomerDetailsApiSlice from './profileApi/ProfileApiSlice';
import getCustomerCartItemsAliSlice from './CartApi/CartApiSlice';
import getCheckoutDataApiSlice from './checkoutDataApi/CheckoutApiSlice';
import getOrdersDataApiSlice from './ordersApi/OrdersApiSlice';
import customerCartIdApiSlice from './customerCartIdApi/CustomerCartIdApiSlice';

const allReducers = combineReducers({
  getCustomerDetailsApiSlice,
  getCustomerCartItemsAliSlice,
  getCheckoutDataApiSlice,
  customerCartIdApiSlice,
  getOrdersDataApiSlice,
});

const store = configureStore({
  reducer: allReducers,
  middleware: [thunkMiddleware],
});

export default store;
