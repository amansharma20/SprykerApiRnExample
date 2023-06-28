import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useDispatch, useSelector} from 'react-redux';
import {getCheckoutData} from '../../redux/checkoutDataApi/CheckoutApiAsyncThunk';
import CommonOptionsSelector from '../../components/CommonOptionsSelector/CommonOptionsSelector';
import {ActivityIndicator, Alert, Button, ScrollView} from 'react-native';
import {api} from '../../api/SecureAPI';
import {useNavigation} from '@react-navigation/native';

const CheckoutScreen = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartId = props.route.params?.cartId;
  const cartItemsArray = props.route.params?.cartItemsArray;

  const [isLoading, setIsLoading] = useState(false);
  const [isOrderConfirmedLoading, setIsOrderConfirmedLoading] = useState(false);

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [selectedShipmentIndex, setSelectedShipmentIndex] = useState(0);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(0);

  const [checkoutFormattedData, setCheckoutFormattedData] = useState();

  const [cartData, setCartData] = useState([]);
  const [items, setItems] = useState([]);

  const checkoutData = useSelector(
    state => state.getCheckoutDataApiSlice.checkoutData.data,
  );

  function createArraysForType(arr) {
    const result = {};

    arr?.forEach(item => {
      const type = item.type;

      if (!result[type]) {
        result[type] = [];
      }

      result[type].push(item);
    });

    setCheckoutFormattedData(result);
  }

  // addresses

  const addresses = checkoutFormattedData?.addresses;

  const ADDRESSES_DATA = addresses?.map(item => {
    const title = `${item?.attributes?.address1} , ${item?.attributes?.city} , ${item?.attributes?.country} , ${item?.attributes?.zipCode} , ${item?.attributes?.phone} `;
    const firstName = item?.attributes?.firstName;
    return {
      title: title,
      value: item?.attributes?.address1,
      firstName: firstName,
      type: 'address',
    };
  });

  // shipment methods

  const shipmentMethods = checkoutFormattedData?.['shipment-methods'];

  const SHIPMENTMETHODS_DATA = shipmentMethods?.map(item => {
    return {
      title: item?.attributes?.carrierName,
      value: item?.attributes?.carrierName,
    };
  });

  // shipments

  const shipments = checkoutFormattedData?.['shipments'];

  const SHIPMENTS_DATA = shipments?.map(item => {
    return {
      title: item?.attributes?.carrierName,
      value: item?.attributes?.carrierName,
    };
  });

  // payment methods

  const paymentMethods = checkoutFormattedData?.['payment-methods'];

  const PAYMENTMETHODS_DATA = paymentMethods?.map(item => {
    return {
      title: item?.attributes?.paymentProviderName,
      value: item?.attributes?.paymentProviderName,
    };
  });

  const orderData = {
    data: {
      type: 'checkout',
      attributes: {
        customer: {
          email: 'sonia@spryker.com',
          salutation: 'sonia',
          firstName: 'string',
          lastName: 'string',
        },
        idCart: cartId,
        billingAddress: addresses?.[selectedAddressIndex]?.attributes,
        payments: [
          {
            ...paymentMethods?.[selectedPaymentIndex]?.attributes,
          },
        ],
        shipments: [
          {
            shippingAddress: addresses?.[selectedAddressIndex]?.attributes,
            items: cartItemsArray,
            idShipmentMethod: 1,
            requestedDeliveryDate: '2023-06-23',
          },
        ],
      },
    },
  };

  const orderConfirm = async () => {
    setIsOrderConfirmedLoading(true);
    try {
      const response = await api.post('checkout', JSON.stringify(orderData));
      if (response.data.status === 201) {
        // console.log('response: ', response);
        // console.log('response?.data?.data?.data: ', response?.data?.data?.data);
        Alert.alert('Order Placed Successfully', '', [
          {
            text: 'OK',
            onPress: () =>
              navigation.replace('OrderDetailsScreen', {
                checkoutResponse: response?.data?.data?.data,
              }),
          },
        ]);
        setIsOrderConfirmedLoading(false);
        // dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(
        //   () => {
        //     Alert.alert('Order Placed Successfully', [
        //       {text: 'OK', onPress: () => RNRestart.Restart()},
        //     ]);
        //   },
        // );
        // RNRestart.Restart();
      } else {
        // console.log('response: ', response?.data?.data?.errors?.[0]?.detail);

        Alert.alert(response?.data?.data?.errors?.[0]?.detail, '', [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
        setIsOrderConfirmedLoading(false);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    if (checkoutData) {
      createArraysForType(checkoutData.included);
    }
  }, [checkoutData]);

  useEffect(() => {
    setIsLoading(true);
    const data = {
      data: {
        attributes: {
          idCart: cartId,
          shipmentMethods: [],
        },
        type: 'checkout-data',
      },
    };

    dispatch(
      getCheckoutData({
        endpoint:
          'checkout-data?include=shipments%2Cshipment-methods%2Caddresses%2Cpayment-methods%2Citems',
        data: data,
      }),
    ).then(res => {
      if (res.payload.status === 200) {
        let tempArr = [];
        res?.included?.map(item => {
          tempArr.push(item.id);
        });
        setItems(tempArr);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        // console.log('res.payload.status: ', res.payload.data.errors[0].detail);
        alert(res?.payload?.data?.errors?.[0]?.detail);
      }
    });
  }, [dispatch, cartId]);

  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <CommonHeader title={'Checkout'} />
        {!isLoading ? (
          <>
            <Box paddingHorizontal="paddingHorizontal">
              <Box mb="s16">
                <Text mb="s16" variant="regular16">
                  Select Address
                </Text>
                <CommonOptionsSelector
                  DATA={ADDRESSES_DATA}
                  selectedIndex={selectedAddressIndex}
                  setSelectedIndex={setSelectedAddressIndex}
                  hideContinueButton
                />
              </Box>
              <Box mb="s16">
                <Text mb="s16" variant="regular16">
                  Select shipment methods
                </Text>
                <CommonOptionsSelector
                  DATA={SHIPMENTMETHODS_DATA}
                  selectedIndex={selectedShipmentIndex}
                  setSelectedIndex={setSelectedShipmentIndex}
                  hideContinueButton
                />
              </Box>
              <Box mb="s16">
                <Text mb="s16" variant="regular16">
                  Select payment method
                </Text>
                <CommonOptionsSelector
                  DATA={PAYMENTMETHODS_DATA}
                  selectedIndex={selectedPaymentIndex}
                  setSelectedIndex={setSelectedPaymentIndex}
                  hideContinueButton
                />
              </Box>
            </Box>
          </>
        ) : (
          <>
            <ActivityIndicator />
          </>
        )}
      </ScrollView>
      {!isOrderConfirmedLoading ? (
        <>
          <Button title="Continue" onPress={orderConfirm} />
        </>
      ) : (
        <>
          <ActivityIndicator />
        </>
      )}
    </Box>
  );
};

export default CheckoutScreen;
