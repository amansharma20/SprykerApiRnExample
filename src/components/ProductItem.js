/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {Alert, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Text} from '@atoms';
import Icons from '../assets/constants/Icons';
import {api} from '../api/SecureAPI';
import {useDispatch, useSelector} from 'react-redux';
import {getCustomerCartItems} from '../redux/CartApi/CartApiAsyncThunk';
import {CustomerCartIdApiAsyncThunk} from '../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import CommonLoading from './CommonLoading';
import {getCustomerWishlist} from '../redux/wishlist/GetWishlistApiAsyncThunk';
import {getProductsByWishlistAsyncThunk} from '../redux/wishlist/ProductsWishlistApiAsyncThunk';

export default function ProductItem({item, includedData, index}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [isProductExistInShoppingList, setIsProductExistInShoppingList] =
    useState(false);

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

  const productDataForShoppingList = {
    data: {
      type: 'shopping-list-items',
      attributes: {
        productOfferReference: null,
        quantity: 1,
        sku: concreteId,
      },
    },
  };

  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  const customerWishlistFirstId = useSelector(
    state =>
      state?.getWishlistApiSlice?.customerWishlistData?.data?.data?.[0]?.id ||
      [],
  );

  const productsByWishlist = useSelector(
    state =>
      state?.getProductsByWishlistApiSlice?.productsByWishlist?.data || [],
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

  const checkIfAddedInShoppingList = () => {
    const productIds = [];

    productsByWishlist?.included?.forEach(element => {
      if (element.type === 'concrete-products') {
        productIds.push({
          id: element.id,
        });
      }
    });

    return productIds.some(item => item.id === concreteId);
    // console.log('idExists: ', idExists);

    // if (idExists) {
    //   setIsProductExistInShoppingList(true);
    // } else {
    //   setIsProductExistInShoppingList(false);
    // }
  };

  const onPressAddToShoppingList = async () => {
    const response = await api.post(
      `shopping-lists/${customerWishlistFirstId}/shopping-list-items`,
      productDataForShoppingList,
    );
    if (response?.data?.status === 201) {
      dispatch(getCustomerWishlist('shopping-lists'));
      dispatch(
        getProductsByWishlistAsyncThunk(
          `shopping-lists/${customerWishlistFirstId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
        ),
      ).then(() => {
        // const wait = new Promise(resolve => setTimeout(resolve, 1000));
        // wait.then(() => {
        // handleClosePress();
        checkIfAddedInShoppingList();
        // });
      });
      alert('Added to shopping list');
    } else {
      Alert.alert('Error', response.data.data.errors?.[0]?.detail, [
        {
          text: 'OK',
          // onPress: () =>
          //   navigation.replace('OrderDetailsScreen', {
          //     checkoutResponse: response?.data?.data?.data,
          //   }),
        },
      ]);
    }
  };

  const renderWishlistButton = useCallback(() => {
    if (checkIfAddedInShoppingList()) {
      // return <Text>true</Text>;
      return (
        <Image
          style={{width: 24, height: 24, resizeMode: 'contain'}}
          source={Icons.addedToWishlistIcon}
        />
      );
    } else {
      // return <Text>false</Text>;
      return (
        <Image
          style={{width: 24, height: 24, resizeMode: 'contain'}}
          source={Icons.wishlistIcon}
        />
      );
    }
  }, [productsByWishlist]);

  useEffect(() => {
    checkIfAddedInShoppingList();
  }, [productsByWishlist]);

  return (
    <Box
      // flex={1}
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
        <Box position="absolute" alignSelf="flex-end">
          <TouchableOpacity onPress={onPressAddToShoppingList}>
            {/* <Text>add to wishlist</Text> */}
            {renderWishlistButton()}
          </TouchableOpacity>
        </Box>
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
