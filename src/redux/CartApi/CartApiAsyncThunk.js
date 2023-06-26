import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/SecureAPI';

export const getCustomerCartItems = createAsyncThunk(
  'cartItems',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.get(endpoint);
      console.log('response99: ', response);

      return response.data;
    } catch (error) {
      return error;
    }
  },
);
