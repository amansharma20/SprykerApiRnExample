/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Text} from '@atoms';
import Icons from '../assets/constants/Icons';
import {api} from '../api/SecureAPI';
import {useDispatch, useSelector} from 'react-redux';
import {getCustomerCartItems} from '../redux/CartApi/CartApiAsyncThunk';
import {CustomerCartIdApiAsyncThunk} from '../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import CommonLoading from './CommonLoading';

export default function ProductItem({item, includedData, index}) {
  // console.log('item: ', item);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const includedSingleProductData = includedData?.[index];

  const concreteId =
    includedSingleProductData?.attributes?.attributeMap
      ?.product_concrete_ids?.[0];

  const productData = {
    data: {
      type: 'items',
      attributes: {
        sku: concreteId,
        quantity: 1,
        salesUnit: {
          id: 0,
          amount: 0,
        },
        productOptions: [null],
      },
    },
  };

  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  const onPressAddToCart = async () => {
    CommonLoading.show();
    const response = await api.post(
      `carts/${customerCart.id}/items`,
      productData,
    );
    if (response?.data?.status === 201) {
      dispatch(
        getCustomerCartItems(
          `carts/${customerCart.id}?include=items%2Cbundle-items`,
        ),
      ).then(res => {
        if (res.payload.status === 200) {
          alert('Added to Cart');
        }
        CommonLoading.hide();
      });
      dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
    } else {
      alert('error', response.data.data.errors?.[0]?.detail);
      CommonLoading.hide();
    }
  };

  return (
    <Box
      flex={1}
      marginHorizontal="s4"
      flexShrink={1}
      mb="s8"
      borderWidth={1}
      borderColor="border"
      borderRadius={8}
      padding="s8">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductDetailsScreen', {
            product: item,
          });
        }}>
        <Box alignItems="center">
          <Image
            source={{uri: item?.images[0]?.externalUrlSmall}}
            style={styles.productImage}
          />
        </Box>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.abstractName}
        </Text>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingVertical="s2">
          <Box>
            <Text fontSize={14} fontWeight="600">
              $ {item.price}
            </Text>
          </Box>
          <TouchableOpacity onPress={onPressAddToCart}>
            <Box
              backgroundColor="purple"
              padding="s4"
              paddingHorizontal="s8"
              borderRadius={8}
              flexDirection="row"
              alignItems="center">
              <Text
                fontSize={14}
                color="white"
                fontWeight="600"
                marginRight="s4">
                Add
              </Text>
              <Image
                source={Icons.addToCartIcon}
                style={{width: 24, height: 24, tintColor: 'white'}}
              />
            </Box>
          </TouchableOpacity>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}

const styles = StyleSheet.create({
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
    backgroundColor: 'white',
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    borderRadius: 14,
  },
});
