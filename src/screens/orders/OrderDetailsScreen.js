import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {ActivityIndicator, Button, FlatList} from 'react-native';
import RNRestart from 'react-native-restart';
import {useDispatch, useSelector} from 'react-redux';
import {getOrderDetailsData} from '../../redux/orderDetailsApi/OrderDetailsApiAsyncThunk';

const OrderDetailsScreen = props => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const orderId = props.route.params?.orderId;
  console.log('orderId: ', orderId);
  const checkoutResponse = props.route.params?.checkoutResponse;

  const orderReference =
    checkoutResponse?.attributes?.orderReference || orderId;
  console.log('orderReference: ', orderReference);

  const orderDetails = useSelector(
    state =>
      state.getOrderDetailsDataApiSlice.orderDetailsData?.data?.data
        ?.attributes,
  );
  console.log('orderDetails: ', orderDetails);

  const orderItemsData = orderDetails?.items;
  console.log('orderItemsData: ', orderItemsData);

  const renderItem = ({item}) => {
    return (
      <Box>
        <Text>{item?.name}</Text>
      </Box>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getOrderDetailsData(`orders/${orderReference}`)).then(res => {
      // console.log('res: ', res);
      setIsLoading(false);
    });
  }, [dispatch, orderReference]);

  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={'Order Details'} />
      <Box flex={1} paddingHorizontal="paddingHorizontal">
        {!isLoading ? (
          <>
            <>
              <Text textAlign="center">
                Thank You! Your order has been placed successfully, your Order
                ID is -{orderReference}
              </Text>
              <Text marginVertical="s16">Ordered Items -</Text>
              <FlatList data={orderItemsData} renderItem={renderItem} />
              <Button title="Go to home" onPress={() => RNRestart.Restart()} />
            </>
          </>
        ) : (
          <>
            <ActivityIndicator />
          </>
        )}
      </Box>
    </Box>
  );
};

export default OrderDetailsScreen;
