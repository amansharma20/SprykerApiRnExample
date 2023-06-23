import React, {useEffect, useState} from 'react';
import {api} from '../../api/SecureAPI';
import {Box, Text} from '@atoms';
import {TouchableOpacity, Image} from 'react-native';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CartItemQuantity from './CartItemQuantity';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';

const CartItem = ({item}) => {
  const dispatch = useDispatch();

  const cartItem = item?.item;
  const [attributes, setAttributes] = useState([]);
  const [productImage, setProductImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  useEffect(() => {
    const getProductDetails = async () => {
      if (cartItem) {
        await api.get(`concrete-products/${cartItem?.sku}`).then(res => {
          const attributesData = res?.data?.data?.data?.attributes;
          if (attributesData) {
            setAttributes(attributesData);
          }
        });
      }
    };
    getProductDetails();
    // get image
    getProductImage = async () => {
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
            getCustomerCartItems(`carts/${customerCart.id}?include=items`),
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
      padding="s16">
      {isLoading == true ? <ActivityIndicator /> : ''}
      <Box flexDirection="row">
        <Box width={'40%'}>
          <Image
            style={{width: '100%', height: 80}}
            source={{
              uri: productImage,
            }}
          />
          <CartItemQuantity
            cartItem={cartItem}
            removeItemTrigger={removeItem}
          />
        </Box>
        <Box width={'60%'} ml="s40">
          <Box flexDirection="row">
            <Text>{attributes?.name}</Text>
          </Box>
          <Text style={{fontWeight: 'bold', marginTop: 4}}>
            $ {cartItem.itemPrice}
          </Text>
          <TouchableOpacity
            style={{marginTop: 70}}
            onPress={() => removeItem(cartItem.itemId)}>
            <Text style={styles.removeItemButton}>Remove Item</Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  removeItemButton: {
    color: 'black',
    padding: 8,
    borderRadius: 4,
    fontWeight: 'bold',
  },
});

export default CartItem;
