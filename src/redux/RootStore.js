import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import getCustomerDetailsApiSlice from './profileApi/ProfileApiSlice';
import getCustomerCartItemsAliSlice from './CartApi/CartApiSlice';
import getCheckoutDataApiSlice from './checkoutDataApi/CheckoutApiSlice';
import getOrdersDataApiSlice from './ordersApi/OrdersApiSlice';
import customerCartIdApiSlice from './customerCartIdApi/CustomerCartIdApiSlice';
import getOrderDetailsDataApiSlice from './orderDetailsApi/OrderDetailsApiSlice';
import getWishlistApiSlice from './wishlist/GetWishlistApiSlice';
import getProductsByWishlistApiSlice from './wishlist/ProductsWishlistApiSlice';
const allReducers = combineReducers({
  getCustomerDetailsApiSlice,
  getCustomerCartItemsAliSlice,
  getCheckoutDataApiSlice,
  customerCartIdApiSlice,
  getOrdersDataApiSlice,
  getOrderDetailsDataApiSlice,
  getWishlistApiSlice,
  getProductsByWishlistApiSlice,
});

const store = configureStore({
  reducer: allReducers,
  middleware: [thunkMiddleware],
});

export default store;
