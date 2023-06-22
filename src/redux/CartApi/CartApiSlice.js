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
      // console.log('my cart item', cartItem);
      cartItem.map(item => {
        // console.log('my map fun', item.attributes.quantity);
        newCartItems.push({
          sku: item.attributes.sku,
          quantity: item.attributes.quantity,
          itemId: item.id,
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

// console.log('response-data123: ', response.data.data.included);
// var cartItem = response.data.data.included;
// var newCartItems = [];
// cartItem.map(item => {
//   newCartItems.push({
//     sku: item.attributes.sku,
//     quantity: item.attributes.quantity,
//   });
// });
