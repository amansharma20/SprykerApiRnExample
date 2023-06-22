import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/SecureAPI';

export const CustomerCartIdApiAsyncThunk = createAsyncThunk(
  'customerCartDetails',
  async (endpoint, thunkAPI) => {
    try {
      const response = await api.get(endpoint);
      return response?.data;
      //   return response?.data?.data?.data?.[0];
    } catch (error) {
      return error;
    }
  },
);
