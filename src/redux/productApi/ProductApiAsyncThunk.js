import {createAsyncThunk} from '@reduxjs/toolkit';
import {commonApi} from '../../api/CommanAPI';

export const getProductDetails = createAsyncThunk(
  'productDetails',
  async (endpoint, thunkAPI) => {
    try {
      const response = await commonApi.get(endpoint);
      const existingItems =
        thunkAPI.getState().getProductDetailsAliSlice?.productDetails || [];
      console.log('existingItems: ', existingItems);
      // const updatedItems = [...existingItems, response.data.data];
      // console.log(updatedItems);
      return existingItems;
    } catch (error) {
      return error;
    }
  },
);
