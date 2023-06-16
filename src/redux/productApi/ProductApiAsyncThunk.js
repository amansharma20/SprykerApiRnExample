import {createAsyncThunk} from '@reduxjs/toolkit';
import {commonApi} from '../../api/CommanAPI';

export const getProductDetails = createAsyncThunk(
  'productDetails',
  async (endpoint, thunkAPI) => {
    try {
      const response = await commonApi.get(endpoint);
      const existingItems =
        thunkAPI.getState().getProductDetailsAliSlice?.productDetails || [];
      const updatedItems = [...existingItems, response.data.data];
      console.log(updatedItems);
      return updatedItems;
    } catch (error) {
      return error;
    }
  },
);
