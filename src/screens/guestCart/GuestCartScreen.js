import {Box, Text, theme} from '@atoms';
import React, {useState, useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GuestCartItem from './GuestCartItems';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {guestCartData} from '../../redux/GuestCartApi/GuestCartApiAsyncThunk';
const GuestCartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const guestCartItems = useSelector(
    state => state.getGuestCartDataApiSlice?.guestCartData,
  );

  useEffect(() => {
    const guestCart = async () => {
      setIsLoading(true);
      const guestCustomerUniqueId = await AsyncStorage.getItem(
        'guestCustomerUniqueId',
      );

      if (guestCustomerUniqueId) {
        const headers = {
          'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
        };
        dispatch(
          guestCartData({
            endpoint:
              'https://glue.de.faas-suite-prod.cloud.spryker.toys/guest-carts?include=guest-cart-items%2Cbundle-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-availabilities',
            data: headers,
          }),
        ).then(() => {
          setIsLoading(false);
          console.log('redux called successfully');
        });
        setIsLoading(false);
      }
    };
    guestCart();
  }, []);
  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={'Your Cart'} />
      {isLoading ? (
        <>
          <ActivityIndicator />
        </>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: theme.spacing.paddingHorizontal,
            }}>
            <FlatList
              data={guestCartItems}
              renderItem={item => {
                const data = item?.item;
                return <GuestCartItem item={data} />;
              }}
            />
          </ScrollView>
        </>
      )}
    </Box>
  );
};
export default GuestCartScreen;
