import React, {useEffect, useState} from 'react';
import Box from '../../atoms/box';
import Text from '../../atoms/text';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {api} from '../../api/SecureAPI';
import {getCustomerWishlist} from '../../redux/wishlist/GetWishlistApiAsyncThunk';
import {useSelector, useDispatch} from 'react-redux';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
const WishlistScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const customerWishlist = useSelector(
    state => state?.getWishlistApiSlice?.customerWishlistData?.data?.data || [],
  );

  const addNewWishlist = async () => {
    const wishlistPayload = {
      data: {
        type: 'shopping-lists',
        attributes: {
          name: 'My Shopping List testing',
        },
      },
    };
    const resp = await api.post(
      `shopping-lists`,
      JSON.stringify(wishlistPayload),
    );
    console.log('resps: ', resp.data.data);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCustomerWishlist('shopping-lists')).then(() => {
      setIsLoading(false);
    });
  }, []);
  const renderItem = item => {
    const wishlist = item?.item?.attributes;
    return (
      <Box style={styles.wishlistItemContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WishlistItemsScreen', {id: item?.item?.id});
          }}
          style={styles.quantityButton}>
          <Text style={styles.wishlistItemName}>{wishlist.name}</Text>
          <Text style={styles.wishlistItemNumberOfItems}>
            Total Items :
            {wishlist.numberOfItems !== null ? wishlist.numberOfItems : '0'}
          </Text>
        </TouchableOpacity>
      </Box>
    );
  };
  return (
    <Box style={styles.container}>
      <CommonHeader title={'Wish List'} />
      <Box m="s8">
        <Box
          color="borderGrey"
          backgroundColor="white"
          borderRadius={4}
          borderWidth={1}
          mb="s6"
          m="s12"
          paddingHorizontal="s2"
          flexDirection="row">
          <TextInput
            placeholder="Enter Name here"
            placeholderTextColor="gray"
          />
        </Box>

        <CommonSolidButton
          title="Add new wishlist"
          onPress={() => addNewWishlist()}
        />
        <Text mt="s8" style={styles.title}>
          Your wishlist
        </Text>
        <FlatList data={customerWishlist} renderItem={renderItem} />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  wishlistItemContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  wishlistItemName: {
    fontSize: 16,
  },
});

export default WishlistScreen;
