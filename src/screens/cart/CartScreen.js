/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Button, FlatList, TextInput} from 'react-native';
import {Box, Text} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import CartItem from './CartItem';
import {useNavigation} from '@react-navigation/native';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import LoginScreen from '../auth/LoginScreen';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';

const CartScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  const {isUserLoggedIn} = useIsUserLoggedIn();
  const [allProductAvailableInCarts, setAllProductsAvailableInCarts] =
    useState(true);
  const dispatch = useDispatch();

  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );
  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  const grandTotal = customerCart?.attributes?.totals?.grandTotal;

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
        setIsLoading(false);
      });
    }
  }, [dispatch, customerCartId, isUserLoggedIn]);

  // useEffect(() => {
  //   if (isUserLoggedIn) {
  //     dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {
  //       console.log('carts api call successful');
  //     });
  //   }
  // }, [isUserLoggedIn]);

  const checkProductAvailability = isAllProductAvailableInCarts => {
    console.log('isAllProductAvailableInCarts: ', isAllProductAvailableInCarts);
    if (!isAllProductAvailableInCarts) {
      setAllProductsAvailableInCarts(false);
    }
  };

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
                    return (
                      <CartItem
                        item={item}
                        checkProductAvailability={checkProductAvailability}
                      />
                    );
                  }}
                  contentContainerStyle={{paddingBottom: 100}}
                  ListEmptyComponent={ListEmptyComponent}
                />
                <Box
                  color="borderGrey"
                  backgroundColor="white"
                  borderRadius={4}
                  borderWidth={1}
                  mb="s10"
                  paddingVertical="s8"
                  paddingHorizontal="s4">
                  <TextInput
                    placeholder="Enter Promo Code"
                    placeholderTextColor="gray"
                  />
                </Box>
                <Box
                  justifyContent="flex-end"
                  flexDirection="row"
                  paddingVertical="s8">
                  <Text variant="bold24">Total : $ {grandTotal}</Text>
                </Box>
                {customerCartData?.length !== 0 ? (
                  <Box paddingVertical="s16">
                    <CommonSolidButton
                      title="Proceed to Checkout"
                      disabled={!allProductAvailableInCarts}
                      onPress={() =>
                        navigation.navigate('CheckoutScreen', {
                          cartId: customerCartId,
                          cartItemsArray: cartItemsArray,
                        })
                      }
                    />
                  </Box>
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
