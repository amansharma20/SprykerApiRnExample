import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Image,
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
      <Box flexDirection="row">
        <Image
          style={styles.backImage}
          source={{
            uri: item?.metadata?.image,
          }}
        />
        <Box flexDirection="column" ml="s40">
          <Text>{item?.name}</Text>
          <Text>Quantity: {item?.quantity}</Text>
          <Text>Price: ${item?.sumSubtotalAggregation}</Text>
        </Box>
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

              <Text mb="s2" marginVertical="s16" style={{fontWeight: 'bold'}}>
                Your Order -
              </Text>
              <Text mb="s16" style={styles.horizontalLine} />

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
              <Box mb="s12">
                <Button
                  title="Go to home"
                  onPress={() => RNRestart.Restart()}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  backImage: {
    resizeMode: 'contain',
    width: '20%',
    height: 70,
  },
});
export default OrderDetailsScreen;
