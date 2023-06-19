import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import {Box, Text} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  console.log('isLoading: ', isLoading);

  const dispatch = useDispatch();

  const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );
  console.log('customerCartData: ', customerCartData);

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
