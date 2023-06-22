import React, {useState, useEffect} from 'react';
import {Button, FlatList} from 'react-native';
import {Box} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {api} from '../../api/SecureAPI';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import CartItem from './CartItem';
import {useNavigation} from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [cartItemsArray, setCartItemsArray] = useState([]);

  const dispatch = useDispatch();

  // const customerCartId = 'a25265da-ec75-5854-bf07-c5b35d09e6ad';

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );

  useEffect(() => {
    if (customerCartData && customerCartId) {
      let tempArr = [];
      customerCartData?.map(item => {
        tempArr.push(item.itemId);
      });
      setCartItemsArray(tempArr);
    }
  }, [customerCartData, customerCartId]);

  useEffect(() => {
    if (customerCartId) {
      setIsLoading(true);
      dispatch(
        getCustomerCartItems(`carts/${customerCartId}?include=items`),
      ).then(() => {
        setIsLoading(false);
      });
    }
  }, [dispatch, customerCartId]);

  // useEffect(() => {
  //   const getCarts = async () => {
  //     const response = await api.get('carts');
  //     if (response?.data?.status === 200) {
  //       setCartId(response?.data.data.data?.[1]?.id);
  //     }
  //   };
  //   getCarts();
  // }, []);
  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );
  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={'Your Cart'} />
      <Box flex={1} paddingHorizontal="paddingHorizontal">
        <FlatList
          data={customerCartData}
          renderItem={item => {
            return <CartItem item={item} />;
          }}
          contentContainerStyle={{paddingBottom: 100}}
        />
        {customerCartData?.length !== 0 ? (
          <>
            <Button
              title="Proceed to Checkout"
              onPress={() =>
                navigation.navigate('CheckoutScreen', {
                  cartId: customerCartId,
                  cartItemsArray: cartItemsArray,
                })
              }
            />
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
export default CartScreen;
