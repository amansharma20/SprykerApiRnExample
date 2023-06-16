import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/SecureAPI';

export const getCustomerCartItems = createAsyncThunk(
  'cartItems',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.get(endpoint);
      console.log('response-data123: ', response.data.data.included);
      var cartItem = response.data.data.included;
      var newCartItems = [];
      cartItem.map(item => {
        newCartItems.push({
          sku: item.attributes.sku,
          quantity: item.attributes.quantity,
        });
      });
      return newCartItems;
    } catch (error) {
      return error;
    }
  },
);
