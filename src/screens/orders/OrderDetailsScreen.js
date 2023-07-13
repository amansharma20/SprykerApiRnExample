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
  const [configuredBundledOrders, setConfiguredBundleOrders] = useState([]);

  const orderId = props.route.params?.orderId;
  // console.log('orderId: ', orderId);
  const checkoutResponse = props.route.params?.checkoutResponse;

  const orderReference =
    checkoutResponse?.attributes?.orderReference || orderId;
  // console.log('orderReference: ', orderReference);

  const orderDetails = useSelector(
    state => state.getOrderDetailsDataApiSlice.orderDetailsData?.data,
  );
  // console.log('orderDetails: ', orderDetails?.data?.attributes?.items);

  const orderItemsData = orderDetails?.data?.attributes?.items;
  // const configuredBundleOrderedItems =[];
  useEffect(() => {
    const uuidsSet = new Set();
    orderItemsData?.forEach(items => {
      if (items?.salesOrderConfiguredBundle != null) {
        const uuid =
          items?.salesOrderConfiguredBundle?.idSalesOrderConfiguredBundle;
        if (uuid) {
          uuidsSet.add(uuid);
        }
      }
    });
    const uuids = Array.from(uuidsSet).map(uuid => ({uuid: uuid}));
    const newDataArray = uuids.map(uuidObj => {
      const foundObjects = orderItemsData.filter(obj => {
        if (obj.salesOrderConfiguredBundle != null) {
          if (
            obj.salesOrderConfiguredBundle?.idSalesOrderConfiguredBundle ===
            uuidObj.uuid
          )
            return obj;
        }
      });
      const templateName = orderItemsData.find(
        item =>
          item.salesOrderConfiguredBundle?.idSalesOrderConfiguredBundle ===
          uuidObj.uuid,
      )?.salesOrderConfiguredBundle?.name;
      const quantity = orderItemsData.find(
        item =>
          item.salesOrderConfiguredBundle?.idSalesOrderConfiguredBundle ===
          uuidObj.uuid,
      )?.salesOrderConfiguredBundle?.quantity;
      return {templateName, foundObjects, quantity};
    });
    setConfiguredBundleOrders(newDataArray);
  }, [orderId]);

  const orderDetail = orderDetails?.data?.attributes;
  const orderShipment = orderDetails?.included;

  const renderItem = ({item}) => {
    if (item?.salesOrderConfiguredBundle != null) return;
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

  const configuredBundles = items => {
    const data = items?.foundObjects;
    return (
      <Box
        borderRadius={8}
        borderColor="border"
        borderWidth={1}
        mb="s8"
        padding="s8"
        backgroundColor="white">
        <Box flexDirection="row" justifyContent="space-between">
          <Box>
            <Text>{items?.templateName}</Text>
          </Box>

          <Box>
            <Text>Quantity:{items?.quantity}</Text>
          </Box>
        </Box>

        {data.map(item => {
          return (
            <Box
              borderRadius={8}
              borderColor="border"
              borderWidth={1}
              mb="s8"
              padding="s8"
              backgroundColor="white"
              key={item.sku}>
              <Box flexDirection="row">
                <Box alignItems="center" mr="s8">
                  <Image
                    style={{height: 120, width: 120, resizeMode: 'contain'}}
                    source={{
                      uri: item?.metadata?.image,
                    }}
                  />
                </Box>
                <Box justifyContent="space-between">
                  <Box>
                    <Box flexDirection="row">
                      <Text>{item.name}</Text>
                    </Box>
                    <Text style={{fontWeight: 'bold', marginTop: 4}}>
                      {item.sumPrice}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
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
                data={configuredBundledOrders}
                renderItem={({item}) => configuredBundles(item)}
                contentContainerStyle={{flex: 1}}
              />
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
