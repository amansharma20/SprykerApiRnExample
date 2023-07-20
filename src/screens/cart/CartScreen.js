/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import {Box, Text, theme} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import CartItem from './CartItem';
import {useNavigation} from '@react-navigation/native';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import LoginScreen from '../auth/LoginScreen';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import ConfiguredBundledCartItem from './ConfiguredBundledCartItem';
import {createCustomerCart} from '../../redux/createCustomerCart/CreateCustomerCartApiAsyncThunk';

const CartScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  console.log('isLoading: ', isLoading);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  const {isUserLoggedIn} = useIsUserLoggedIn();
  const [configuredBundleTemplateID, setConfiguredBundleTemplateID] = useState(
    [],
  );
  const [allProductAvailableInCarts, setAllProductsAvailableInCarts] =
    useState(true);
  const dispatch = useDispatch();

  const customerCarts = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data || [],
  );

  useEffect(() => {
    if (customerCarts.length === 0) {
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
      ).then(res => {});
      dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {
        console.log('carts api call successful');
      });
    }

    dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {
      console.log('carts api call successful');
    });
  }, []);

  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );
  console.log('customerCartData: ', customerCartData);

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
    }
    const getConfiguredBundle = () => {
      const uuidsSet = new Set();

      customerCartData?.forEach(items => {
        if (items?.configuredBundle != null) {
          const uuid = items?.configuredBundle?.groupKey;
          if (uuid) {
            uuidsSet.add(uuid);
          }
        }
      });
      const uuids = Array.from(uuidsSet).map(uuid => ({uuid: uuid}));

      const newDataArray = uuids.map(uuidObj => {
        const templateName = customerCartData.find(
          item => item.configuredBundle?.groupKey === uuidObj.uuid,
        )?.configuredBundle?.template?.name;
        const templateUUID = customerCartData.find(
          item => item.configuredBundle?.groupKey === uuidObj.uuid,
        )?.configuredBundle?.template?.uuid;
        const slotUUID = customerCartData.find(
          item => item.configuredBundle?.groupKey === uuidObj.uuid,
        )?.configuredBundleItem?.slot?.uuid;
        const quantity = customerCartData.find(
          item => item.configuredBundle?.groupKey === uuidObj.uuid,
        )?.configuredBundle?.quantity;
        const data = customerCartData.filter(
          item => item.configuredBundle?.groupKey === uuidObj.uuid,
        );

        const groupKey = customerCartData.find(
          item => item.configuredBundle?.groupKey === uuidObj.uuid,
        )?.configuredBundle?.groupKey;
        return {templateName, quantity, templateUUID, slotUUID, data, groupKey};
      });
      setConfiguredBundleTemplateID(newDataArray);
    };
    getConfiguredBundle();
  }, [customerCartData, customerCartId]);

  useEffect(() => {
    setIsLoading(true);
    if (customerCartId) {
      dispatch(
        getCustomerCartItems(
          `carts/${customerCartId}?include=items%2Cbundle-items`,
        ),
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
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: theme.spacing.paddingHorizontal,
                }}>
                <Box>
                  <FlatList
                    data={configuredBundleTemplateID}
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
                    data={customerCartData}
                    // data={[]}
                    renderItem={item => {
                      const data = item?.item;
                      if (data?.configuredBundle == null) {
                        return (
                          <CartItem
                            item={item}
                            customerCartData={customerCartData}
                            checkProductAvailability={checkProductAvailability}
                          />
                        );
                      }
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
                  {/* <Box
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
                  </Box> */}
                  <Box
                    justifyContent="flex-end"
                    flexDirection="row"
                    paddingVertical="s8">
                    <Text variant="bold24">Total : $ {grandTotal}</Text>
                  </Box>
                </Box>
              </ScrollView>
              {customerCartData?.length !== 0 ? (
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
