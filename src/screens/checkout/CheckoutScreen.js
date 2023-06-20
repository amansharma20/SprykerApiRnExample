import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useDispatch, useSelector} from 'react-redux';
import {getCheckoutData} from '../../redux/checkoutDataApi/CheckoutApiAsyncThunk';
import CommonOptionsSelector from '../../components/CommonOptionsSelector/CommonOptionsSelector';
import {ActivityIndicator} from 'react-native';

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const cartId = '2d0daf14-f500-5ea7-9425-7f6254ef5ae0';

  const [isLoading, setIsLoading] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  console.log('selectedIndex: ', selectedIndex);

  const [checkoutFormattedData, setCheckoutFormattedData] = useState();

  const checkoutData = useSelector(
    state => state.getCheckoutDataApiSlice.checkoutData.data,
  );

  function createArraysForType(arr) {
    const result = {};

    arr.forEach(item => {
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
      setIsLoading(false);
    });
  }, [dispatch]);

  return (
    <Box flex={1} backgroundColor="white">
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
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                hideContinueButton
              />
            </Box>
            <Box mb="s16">
              <Text mb="s16" variant="regular16">
                Select shipment methods
              </Text>
              <CommonOptionsSelector
                DATA={SHIPMENTMETHODS_DATA}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                hideContinueButton
              />
            </Box>
            <Box mb="s16">
              <Text mb="s16" variant="regular16">
                Select payment method
              </Text>
              <CommonOptionsSelector
                DATA={PAYMENTMETHODS_DATA}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
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
  );
};

export default CheckoutScreen;
