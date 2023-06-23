/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Button, FlatList} from 'react-native';
import {Box, Text} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import CartItem from './CartItem';
import {useNavigation} from '@react-navigation/native';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import LoginScreen from '../auth/LoginScreen';

const CartScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  const {isUserLoggedIn} = useIsUserLoggedIn();

  const dispatch = useDispatch();

  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );

  const ListEmptyComponent = () => {
    return (
      <Box flex={1} justifyContent="center">
        <Text textAlign="center">No Items in cart.</Text>
      </Box>
    );
  };

  useEffect(() => {
    if (customerCartData.length !== 0 && customerCartId) {
      let tempArr = [];
      customerCartData?.map(item => {
        tempArr.push(item.itemId);
      });
      setCartItemsArray(tempArr);
      setIsLoading(false);
    }
  }, [customerCartData, customerCartId]);

  useEffect(() => {
    setIsLoading(true);
    if (customerCartId) {
      dispatch(
        getCustomerCartItems(`carts/${customerCartId}?include=items`),
      ).then(() => {
        console.log('HERE');
        setIsLoading(false);
      });
    }
  }, [dispatch, customerCartId]);

  return (
    <Box flex={1} backgroundColor="white">
      {isUserLoggedIn ? (
        <>
          <CommonHeader title={'Your Cart'} />
          {isLoading ? (
            <>
              <ActivityIndicator />
            </>
          ) : (
            <>
              <Box flex={1} paddingHorizontal="paddingHorizontal">
                <FlatList
                  data={customerCartData}
                  renderItem={item => {
                    return <CartItem item={item} />;
                  }}
                  contentContainerStyle={{paddingBottom: 100}}
                  ListEmptyComponent={ListEmptyComponent}
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
            </>
          )}
        </>
      ) : (
        <>
          <LoginScreen />
        </>
      )}
    </Box>
  );
};
export default CartScreen;
