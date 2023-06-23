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
      const cartItem = action.payload.data.included;
      const newCartItems = [];
      cartItem.map(item => {
        newCartItems.push({
          sku: item.attributes.sku,
          quantity: item.attributes.quantity,
          itemId: item.id,
          itemPrice: item.attributes.calculations.sumPriceToPayAggregation,
        });
      });
      state.customerCart = newCartItems;
    });
    builder.addCase(getCustomerCartItems.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getCustomerCartItemsAliSlice.reducer;
