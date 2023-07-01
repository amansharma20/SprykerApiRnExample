import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/SecureAPI';
export const customerWishlist = createAsyncThunk(
  'createWishlist',
  async ({endpoint, data}, thunkAPI) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
);
