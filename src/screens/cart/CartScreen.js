/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, ScrollView, Alert} from 'react-native';
import {Box, Text, theme} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useNavigation} from '@react-navigation/native';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import LoginScreen from '../auth/LoginScreen';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import ConfiguredBundledCartItem from './ConfiguredBundledCartItem';
import {createCustomerCart} from '../../redux/createCustomerCart/CreateCustomerCartApiAsyncThunk';
import {AuthContext} from '../../navigation/StackNavigator';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import CartItem from './CartItem';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {getCartDataNew} from '../../redux/newCartApi/NewCartApiAsyncThunk';

const CartScreen = () => {
  const {signOut} = useContext(AuthContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  // const [cartItems, setCartItems] = useState(null);
  // console.log('cartItems: ', cartItems);
  const {isUserLoggedIn} = useIsUserLoggedIn();

  const [allProductAvailableInCarts, setAllProductsAvailableInCarts] =
    useState(true);

  const dispatch = useDispatch();

  const customerCarts = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data || [],
  );
  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );
  console.log('customerCartData: ', customerCartData.length);

  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  const customerCartDataNew = useSelector(
    state => state.getCartDataNewApiSlice?.cartDataNew.data,
  );
  console.log('customerCartDataNew: ', customerCartDataNew);

  const newCartApiUrl = `https://cartapi-5g04sc.5sc6y6-1.usa-e2.cloudhub.io/cart?cartId=${customerCartId}`;

  useEffect(() => {
    if (customerCartId) {
      dispatch(getCartDataNew(newCartApiUrl)).then(res => {
        if (res.payload.status === 200) {
          console.log('carts api call successful');
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log('mulesoft carts api call not successful');
        }
      });
    }
  }, []);

  // useEffect(() => {
  //   if (customerCartDataNew?.length !== 0) {
  //     for (const item of customerCartDataNew?.normalProduct) {
  //       const availability =
  //         item?.['concrete-product-availabilities']?.availability;
  //       if (!availability) {
  //         setAllProductsAvailableInCarts(false);
  //         break;
  //       }
  //     }
  //   }
  // }, [customerCartDataNew]);

  // useEffect(() => {
  //   const getCartItems = async () => {
  //     setIsLoading(true);
  //     let userToken = await Keychain.getGenericPassword();
  //     let token = userToken.password;
  //     const res = await axios
  //       .get(
  //         `https://cartapi-5g04sc.5sc6y6-1.usa-e2.cloudhub.io/cart?cartId=${customerCartId}`,
  //         {
  //           headers: {
  //             Authorization: token,
  //             'Content-Type': 'application/json',
  //           },
  //           validateStatus: () => true,
  //         },
  //       )
  //       .catch(function (error) {
  //         console.log('error: ', error);
  //         setIsLoading(false);
  //         if (error) {
  //           Alert.alert('Error', 'something went wrong', [
  //             {
  //               text: 'OK',
  //             },
  //           ]);
  //         }
  //       });

  //     setCartItems(res?.data);
  //     for (const item of res?.data?.normalProduct) {
  //       const availability =
  //         item?.['concrete-product-availabilities']?.availability;
  //       if (!availability) {
  //         setAllProductsAvailableInCarts(false);
  //         break;
  //       }
  //     }
  //     setIsLoading(false);
  //   };
  //   getCartItems();
  // }, []);

  useEffect(() => {
    if (customerCarts.length === 0) {
      console.log('customerCarts.length: ', customerCarts.length);
      const data = {
        type: 'carts',
        attributes: {
          priceMode: 'NET_MODE',
          currency: 'EUR',
          store: 'DE',
          name: 'new cart',
        },
      };
      dispatch(
        createCustomerCart({endpoint: 'carts', data: JSON.stringify(data)}),
      ).then(response => {
        if (response.payload.status === 401) {
          signOut();
        }
      });
      dispatch(CustomerCartIdApiAsyncThunk('carts')).then(response => {
        if (response.payload.status === 401) {
          signOut();
        } else {
          console.log('carts api call successful');
        }
      });
    }
    // dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {
    //   console.log('carts api call successful');
    // });
  }, []);

  const grandTotal = customerCart?.attributes?.totals?.grandTotal;

  const ListEmptyComponent = () => {
    return (
      <Box flex={1} justifyContent="center">
        <Text textAlign="center">No Items in cart.</Text>
      </Box>
    );
  };

  // useEffect(() => {
  //   setIsLoading(true);
  //   if (customerCartId) {
  //     dispatch(
  //       getCustomerCartItems(
  //         `carts/${customerCartId}?include=items%2Cbundle-items`,
  //       ),
  //     ).then(() => {
  //       setIsLoading(false);
  //     });
  //   }
  // }, [dispatch, customerCartId, isUserLoggedIn]);

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
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: theme.spacing.paddingHorizontal,
                }}>
                <Box>
                  <FlatList
                    data={customerCartDataNew?.configureBundle}
                    renderItem={item => {
                      const data = item?.item;
                      return (
                        <ConfiguredBundledCartItem
                          data={data}
                          customerCartId={customerCartId}
                        />
                      );
                    }}
                    scrollEnabled={false}
                  />
                  <FlatList
                    data={customerCartDataNew?.normalProduct}
                    renderItem={item => {
                      const data = item?.item;

                      return <CartItem item={data} />;
                    }}
                    ListEmptyComponent={
                      isLoading === false ? (
                        <ListEmptyComponent />
                      ) : (
                        <ActivityIndicator />
                      )
                    }
                    scrollEnabled={false}
                  />
                  <Box
                    justifyContent="flex-end"
                    flexDirection="row"
                    paddingVertical="s8">
                    <Text>
                      {customerCartData.length != 0 ? (
                        <Text variant="bold24">Total : $ {grandTotal}</Text>
                      ) : (
                        ''
                      )}
                    </Text>
                  </Box>
                </Box>
              </ScrollView>
              {customerCartDataNew?.length !== 0 ? (
                <Box padding="s16">
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
