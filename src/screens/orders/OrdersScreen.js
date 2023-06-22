import React from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const OrdersScreen = () => {
  return (
    <Box flex={1}>
      <CommonHeader title={'Your Orders'} />
      <Text>OrdersScreen</Text>
    </Box>
  );
};

export default OrdersScreen;
