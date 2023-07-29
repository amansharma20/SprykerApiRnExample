import {createSlice} from '@reduxjs/toolkit';
import {guestCartData} from './GuestCartApiAsyncThunk';

const initialState = {
  itemsCount: null,
  guestCartData: [],
  itemTotal: {},
  status: 'idle',
  error: null,
};

const getGuestCartDataApiSlice = createSlice({
  name: 'getGuestCartData',
  initialState,
  extraReducers: builder => {
    builder.addCase(guestCartData.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(guestCartData.fulfilled, (state, action) => {
      state.status = 'success';
      state.itemTotal = action.payload.data;
      if (action?.payload?.included?.length > 0) {
        const concreteProductData = [];
        const image = [];
        const quantity = [];
        const price = [];
        action?.payload?.included.forEach(element => {
          switch (element.type) {
            case 'concrete-products':
              concreteProductData.push({
                id: element.id,
                name: element.attributes.name,
              });
              break;
            case 'concrete-product-image-sets':
              image.push({
                id: element.id,
                image:
                  element?.attributes?.imageSets[0]?.images[0]
                    ?.externalUrlLarge,
              });
              break;
            case 'guest-cart-items':
              quantity.push({
                quantity: element.attributes.quantity,
                id: element.attributes.sku,
                groupKey: element.attributes.groupKey,
                itemId: element.id,
                price: element.attributes.calculations.sumGrossPrice,
              });
              break;
          }
        });

        const guestCartItems = () =>
          quantity.map(concreteProduct => {
            const matchingImage = image.find(
              img => img.id === concreteProduct.id,
            );
            const matchingQuantity = quantity.find(
              qty => qty.id === concreteProduct.id,
            );
            const name = concreteProductData.find(
              item => item.id === concreteProduct.id,
            );
            return {
              id: concreteProduct.id,
              name: name.name,
              image: matchingImage?.image,
              quantity: matchingQuantity?.quantity || 0,
              price: matchingQuantity?.price || 0,
              itemId: matchingQuantity.itemId,
              groupKey: matchingQuantity.groupKey,
            };
          });
        state.guestCartData = guestCartItems();
      }
    });
    builder.addCase(guestCartData.rejected, (state, action) => {
      state.status = 'rejected';
    });
  },
});

export default getGuestCartDataApiSlice.reducer;
