import {useSelector} from 'react-redux';

export const useCartItemsCount = () => {
  const customerCartDataNew = useSelector(
    state => state.getCartDataNewApiSlice?.cartDataNew.data,
  );

  const guestCartData = useSelector(
    state => state.getGuestCartDataApiSlice?.guestCartData,
  );

  function getTotalNormalProductsQuantity(arrayOfObjects) {
    const quantities = arrayOfObjects?.map(
      obj => obj?.itemData?.attributes?.quantity,
    );
    const totalQuantity = quantities?.reduce(
      (accumulator, currentQuantity) => accumulator + currentQuantity,
      0,
    );

    return totalQuantity;
  }

  function getTotalConfiguredProductsQuantity(arrayOfObjects) {
    const quantities = arrayOfObjects?.map(obj => obj?.groupquantity);
    const totalQuantity = quantities?.reduce(
      (accumulator, currentQuantity) => accumulator + currentQuantity,
      0,
    );
    return totalQuantity;
  }

  function getTotalGuestProductsQuantity(arrayOfObjects) {
    const quantities = arrayOfObjects?.map(obj => obj?.quantity);
    const totalQuantity = quantities?.reduce(
      (accumulator, currentQuantity) => accumulator + currentQuantity,
      0,
    );

    return totalQuantity;
  }

  const guestCartItemsCount =
    getTotalGuestProductsQuantity(guestCartData) || null;

  const cartItemsCount =
    getTotalNormalProductsQuantity(customerCartDataNew?.normalProduct) +
      getTotalConfiguredProductsQuantity(
        customerCartDataNew?.configureBundle,
      ) ||
    guestCartItemsCount ||
    null;

  return {cartItemsCount};
};
