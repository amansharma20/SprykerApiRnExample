/* eslint-disable react/no-unstable-nested-components */
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

  const renderItem = ({item, index}) => {
    return (
      <Box
        mb="s4"
        padding="s4"
        borderRadius={2}
        borderColor="border"
        borderWidth={1}
        backgroundColor="snowy">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('OrderDetailsScreen', {
              orderId: item.id,
            })
          }>
          <Box flexDirection="row" justifyContent="space-between" mb="s2">
            <Text>Order Id</Text>
            <Text fontWeight="700">{item.id}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Text>Grand Total</Text>
            <Text fontWeight="700">${item.attributes?.totals?.grandTotal}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Text>Status </Text>
            {item.attributes?.itemStates == 'paid' ? (
              <Text fontWeight="700">Delivered</Text>
            ) : (
              ''
            )}
          </Box>
        </TouchableOpacity>
      </Box>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getOrdersData('customers/DE--21/orders')).then(res => {
      setIsLoading(false);
    });
  }, [dispatch]);

  return (
    <Box flex={1} backgroundColor="white">
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
