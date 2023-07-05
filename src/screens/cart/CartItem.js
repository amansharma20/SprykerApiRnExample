/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {api} from '../../api/SecureAPI';
import {Box, Text} from '@atoms';
import {TouchableOpacity, Image} from 'react-native';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CartItemQuantity from './CartItemQuantity';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {RemoveIcon} from '../../assets/svgs';
const CartItem = ({item, checkProductAvailability}) => {
  const dispatch = useDispatch();

  const cartItem = item?.item;
  const [attributes, setAttributes] = useState([]);
  const [productImage, setProductImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isProductAvailabilityLoading, setIsProductAvailabilityLoading] =
    useState(true);
  const isProductAvailable =
    attributes?.included?.[0]?.attributes?.availability;

  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  useEffect(() => {
    const getProductDetails = async () => {
      if (cartItem) {
        await api
          .get(
            `concrete-products/${cartItem?.sku}?include=concrete-product-availabilities`,
          )
          .then(res => {
            const attributesData = res?.data?.data;
            if (
              attributesData?.included?.[0]?.attributes?.availability == false
            ) {
              checkProductAvailability(false);
            } else {
              checkProductAvailability(true);
            }
            if (attributesData) {
              setAttributes(attributesData);
            }
            setIsProductAvailabilityLoading(false);
          });
      }
    };
    getProductDetails();
    // get image
    const getProductImage = async () => {
      await api
        .get(`concrete-products/${cartItem?.sku}/concrete-product-image-sets`)
        .then(res => {
          const productImageResponse =
            res?.data?.data?.data[0]?.attributes?.imageSets[0]?.images[0]
              ?.externalUrlSmall;
          if (productImageResponse) {
            setProductImage(productImageResponse);
          }
        });
    };
    getProductImage();
  }, [cartItem]);

  const removeItem = async itemId => {
    setIsLoading(true);
    const response = await api
      .Delete(`carts/${customerCart.id}/items/${itemId}`)
      .then(res => {
        if (res.data.status == 204) {
          dispatch(
            getCustomerCartItems(
              `carts/${customerCart.id}?include=items%2Cbundle-items`,
            ),
          ).then(() => {
            setIsLoading(false);
          });
          dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
        }
      });
  };
  return (
    <Box
      borderRadius={8}
      borderColor="border"
      borderWidth={1}
      mb="s8"
      padding="s8"
      backgroundColor="white">
      {isLoading === true ? (
        <ActivityIndicator />
      ) : (
        <Box flexDirection="row">
          <Box alignItems="center" mr="s8">
            <Image
              style={{height: 120, width: 120, resizeMode: 'contain'}}
              source={{
                uri: productImage,
              }}
            />
            <CartItemQuantity
              cartItem={cartItem}
              removeItemTrigger={removeItem}
            />
          </Box>
          <Box justifyContent="space-between">
            <Box>
              <Box flexDirection="row">
                <Text>{attributes?.data?.attributes?.name}</Text>
              </Box>
              <Text style={{fontWeight: 'bold', marginTop: 4}}>
                $ {cartItem.itemPrice}
              </Text>
              {!isProductAvailable && isProductAvailabilityLoading === false ? (
                <Text color="red">Not Available</Text>
              ) : (
                ''
              )}
            </Box>
            <Box mb="s8">
              <TouchableOpacity onPress={() => removeItem(cartItem.itemId)}>
                <Text>
                  <RemoveIcon />
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CartItem;
