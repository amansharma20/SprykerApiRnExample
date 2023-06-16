import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Image} from 'react-native';
import {Box, Text, theme} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {getProductDetails} from '../../redux/productApi/ProductApiAsyncThunk';
import {api} from '../../api/SecureAPI';
const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();
  const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';

  // const cartItemsData = useSelector(
  //   state => state.getCustomerCartItemsAliSlice?.cartItems || [],
  // );

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );
  // console.log('customerCartData: ', customerCartData);

  const customerCartProductDetails = useSelector(
    state =>
      state.getCustomerCartItemsAliSlice?.customerCartProductDetails || [],
  );
  console.log('customerCartProductDetails: ', customerCartProductDetails);

  const productItems = useSelector(
    state => state.getProductDetailsAliSlice?.productDetails || [],
  );

  // useEffect(() => {
  //   if (cartItemsData) {
  //     cartItemsData.forEach(async item => {
  //       try {
  //         await dispatch(getProductDetails(`concrete-products/${item?.sku}`));
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     });
  //   }
  // }, [cartItemsData]);

  //   console.log('cartItemsData: ', cartItemsData);
  useEffect(() => {
    setIsLoading(true);
    dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Box flex={1}>
      <Image
        source={{uri: 'https://www.javatpoint.com/images/logo/jtp_logo.png'}}
        style={{width: '80%', height: 70}}
      />
      <Text>Prolet 20 MM</Text>
      <Text>$2000</Text>
    </Box>
  );
};
export default CartScreen;
