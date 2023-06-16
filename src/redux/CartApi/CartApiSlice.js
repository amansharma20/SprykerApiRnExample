import {createSlice} from '@reduxjs/toolkit';
import {getCustomerCartItems} from './CartApiAsyncThunk';

const initialState = {
  customerCart: [],
  status: 'idle',
  error: null,
};

const getCustomerCartItemsAliSlice = createSlice({
  name: 'getCustomerCartItems',
  initialState,
  extraReducers: builder => {
    builder.addCase(getCustomerCartItems.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(getCustomerCartItems.fulfilled, (state, action) => {
      state.status = 'success';
      state.cartItems = action.payload;
    });
    builder.addCase(getCustomerCartItems.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getCustomerCartItemsAliSlice.reducer;
