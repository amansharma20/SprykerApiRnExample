/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {Image} from 'react-native';
import {Box, Text} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {api} from '../../api/SecureAPI';
import {useFocusEffect} from '@react-navigation/native';

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productDetails, setProductDetails] = useState([]);

  const dispatch = useDispatch();

  const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );
  console.log('customerCartData: ', customerCartData);

  let customerItemDetailsNew = [];

  const getCartProductDetails = async () => {
    if (customerCartData.length > 0) {
      customerCartData?.map(async item => {
        await api.get(`concrete-products/${item.sku}`).then(res => {
          if (res.data.status === 200) {
            const newArray = [...customerItemDetailsNew, res.data.data.data];
            console.log('newArray: ', newArray);
            setProductDetails(newArray);
          }
        });
        // console.log('customerItemDetails: ', customerItemDetails);
      });
    }
  };

  // useEffect(() => {
  //   setIsLoading(true);
  //   dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(() => {
  //     setIsLoading(false);
  //     getCartProductDetails();
  //   });
  // }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(
        () => {
          setIsLoading(false);
          getCartProductDetails();
        },
      );
    }, [customerCartData.length]),
  );

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
