import React, {useEffect, useState} from 'react';
import {api} from '../../api/SecureAPI';
import {Box, Text} from '@atoms';
import {TouchableOpacity, Image} from 'react-native';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {RemoveIcon} from '../../assets/svgs';
import CartItemQuantity from './CartItemQuantity';
import {getCartDataNew} from '../../redux/newCartApi/NewCartApiAsyncThunk';

const CartItem = ({item}) => {
  const image =
    item?.['concrete-product-image-sets']?.imageSets?.[0]?.images?.[0]
      ?.externalUrlLarge;
  const name = item?.['concrete-products']?.name;
  const sku = item?.['concrete-products']?.sku;
  const itemId = item?.itemData?.id;
  var price = item?.itemData?.attributes?.calculations?.sumGrossPrice;
  if (!price) {
    price = item?.itemData?.attributes?.calculations?.sumPrice;
  }
  const availability = item?.['concrete-product-availabilities']?.availability;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  const newCartApiUrl = `https://cartapi-5g04sc.5sc6y6-1.usa-e2.cloudhub.io/cart?cartId=${customerCart.id}`;

  const removeItem = async itemId => {
    setIsLoading(true);
    const response = await api
      .Delete(`carts/${customerCart.id}/items/${itemId}`)
      .then(res => {
        if (res.data.status == 204) {
          // dispatch(
          //   getCustomerCartItems(
          //     `carts/${customerCart.id}?include=items%2Cbundle-items`,
          //   ),
          // ).then(() => {
          //   setIsLoading(false);
          // });
          // dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
          dispatch(getCartDataNew(newCartApiUrl)).then(res => {
            if (res.payload.status === 200) {
              console.log('carts api call successful');
              setIsLoading(false);
            } else {
              console.log('mulesoft carts api call not successful');
              setIsLoading(false);
            }
          });
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
      flex={1}>
      {isLoading === true ? (
        <ActivityIndicator />
      ) : (
        <Box flexDirection="row">
          <Box alignItems="center" mr="s8">
            <Image
              style={{height: 120, width: 120, resizeMode: 'contain'}}
              source={{
                uri: image,
              }}
            />
            <CartItemQuantity cartItem={item} removeItemTrigger={removeItem} />
          </Box>
          <Box justifyContent="space-between">
            <Box>
              <Box flexDirection="row">
                <Text>{name}</Text>
              </Box>
              <Text style={{fontWeight: 'bold', marginTop: 4}}>$ {price}</Text>
              {availability === false ? (
                <Text color="red">Not Available</Text>
              ) : (
                ''
              )}
            </Box>
            <Box mb="s8">
              <TouchableOpacity onPress={() => removeItem(itemId)}>
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
