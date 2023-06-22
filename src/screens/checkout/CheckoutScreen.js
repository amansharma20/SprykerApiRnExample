import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useDispatch, useSelector} from 'react-redux';
import {getCheckoutData} from '../../redux/checkoutDataApi/CheckoutApiAsyncThunk';
import CommonOptionsSelector from '../../components/CommonOptionsSelector/CommonOptionsSelector';
import {ActivityIndicator, Button} from 'react-native';
import {api} from '../../api/SecureAPI';
import RNRestart from 'react-native-restart';

const CheckoutScreen = props => {
  const dispatch = useDispatch();
  const cartId = props.route.params?.cartId;
  const cartItemsArray = props.route.params?.cartItemsArray;

  const [isLoading, setIsLoading] = useState(false);

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
    return {
      title: item?.attributes?.address1,
      value: item?.attributes?.address1,
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
    try {
      const response = await api.post('checkout', JSON.stringify(orderData));
      if (response.data.status === 201) {
        dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(
          () => {},
        );
        RNRestart.Restart();

        alert('Order placed successfully');
      }
    } catch (error) {
      setIsLoading(false);
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
      let tempArr = [];
      res?.included?.map(item => {
        tempArr.push(item.id);
      });
      setItems(tempArr);
      setIsLoading(false);
    });
  }, [dispatch, cartId]);

  return (
    <Box flex={1} backgroundColor="white">
      <Box flex={1}>
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
      </Box>
      <Button title="Continue" onPress={orderConfirm} />
    </Box>
  );
};

export default CheckoutScreen;
