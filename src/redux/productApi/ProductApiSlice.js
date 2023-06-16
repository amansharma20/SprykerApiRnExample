import {createSlice} from '@reduxjs/toolkit';
import {getProductDetails} from './ProductApiAsyncThunk';
const initialState = {
  productDetails: [],
};

const getProductDetailsAliSlice = createSlice({
  name: 'productDetails',
  initialState,
  extraReducers: builder => {
    builder.addCase(getProductDetails.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getProductDetails.fulfilled, (state, action) => {
      state.status = 'success';
      state.productDetails = action.payload;
    });
    builder.addCase(getProductDetails.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getProductDetailsAliSlice.reducer;
