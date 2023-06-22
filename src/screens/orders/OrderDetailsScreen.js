import React from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {Button} from 'react-native';
import RNRestart from 'react-native-restart';

const OrderDetailsScreen = props => {
  const orderId = props.route.params?.orderId;
  console.log('orderId: ', orderId);
  const checkoutResponse = props.route.params?.checkoutResponse;

  const orderReference = checkoutResponse?.attributes?.orderReference;

  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={'Order Details'} />
      <Box flex={1} paddingHorizontal="paddingHorizontal">
        <Text textAlign="center">
          Thank You! Your order has been placed successfully, your Order ID is -
          {orderReference}
        </Text>
        <Button title="Go to home" onPress={() => RNRestart.Restart()} />
      </Box>
    </Box>
  );
};

export default OrderDetailsScreen;
