import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import RNRestart from 'react-native-restart';
import {useDispatch, useSelector} from 'react-redux';
import {getOrderDetailsData} from '../../redux/orderDetailsApi/OrderDetailsApiAsyncThunk';
import OrdertotalCost from './components/OrderTotalCost';

const OrderDetailsScreen = props => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const orderId = props.route.params?.orderId;
  console.log('orderId: ', orderId);
  const checkoutResponse = props.route.params?.checkoutResponse;

  const orderReference =
    checkoutResponse?.attributes?.orderReference || orderId;

  const orderDetails = useSelector(
    state => state.getOrderDetailsDataApiSlice.orderDetailsData?.data,
  );

  const orderItemsData = orderDetails?.data?.attributes?.items;
  const orderDetail = orderDetails?.data?.attributes;
  const orderShipment = orderDetails?.included;

  const renderItem = ({item}) => {
    return (
      <Box>
        <Text>{item?.name}</Text>
        <Box flexDirection="row" justifyContent="space-between">
          <Text>
            {item?.quantity} × ${item?.sumSubtotalAggregation}
          </Text>
          <Text>${item?.sumSubtotalAggregation}</Text>
        </Box>
        <Text></Text>
      </Box>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getOrderDetailsData(`orders/${orderReference}?include=order-shipments`),
    ).then(res => {
      setIsLoading(false);
    });
  }, [dispatch, orderReference]);

  return (
    <ScrollView contentContainerStyle={{backgroundColor: 'white', flexGrow: 1}}>
      <CommonHeader title={'Order Details'} />
      <Box paddingHorizontal="paddingHorizontal">
        {!isLoading ? (
          <>
            <Box>
              <Text textAlign="center">
                Thank You! Your order has been placed successfully, your Order
                ID is -{orderReference}
              </Text>

              <Text marginVertical="s16">Your Order -</Text>
              <Text style={styles.horizontalLine} />

              <FlatList
                data={orderItemsData}
                renderItem={renderItem}
                contentContainerStyle={{flex: 1}}
              />
              <Text style={styles.horizontalLine} />
              <OrdertotalCost
                orderDetail={orderDetail}
                orderShipment={orderShipment}
                orderId={orderId}
              />
              <Button title="Go to home" onPress={() => RNRestart.Restart()} />
            </Box>
          </>
        ) : (
          <>
            <ActivityIndicator />
          </>
        )}
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
});
export default OrderDetailsScreen;
