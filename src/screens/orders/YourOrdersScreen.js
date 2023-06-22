import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useDispatch, useSelector} from 'react-redux';
import {getOrdersData} from '../../redux/ordersApi/OrdersApiAsyncThunk';
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const YourOrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const ordersData = useSelector(
    state => state.getOrdersDataApiSlice.ordersData?.data?.data || [],
  );

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('OrderDetailsScreen', {
            orderId: item.id,
          })
        }>
        <Box flexDirection="row" justifyContent="space-between">
          <Text>Order Id</Text>
          <Text>{item.id}</Text>
        </Box>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getOrdersData('customers/DE--21/orders')).then(res => {
      // console.log('res: ', res);
      setIsLoading(false);
    });
  }, [dispatch]);

  return (
    <Box flex={1}>
      <CommonHeader title={'Your Orders'} />
      {!isLoading ? (
        <>
          <Box flex={1} paddingHorizontal="paddingHorizontal">
            <FlatList data={ordersData} renderItem={renderItem} />
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

export default YourOrdersScreen;
