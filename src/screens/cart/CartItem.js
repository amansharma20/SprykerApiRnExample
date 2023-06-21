import React, {useEffect, useState} from 'react';
import {api} from '../../api/SecureAPI';
import {Box, Text} from '@atoms';
import {TouchableOpacity, Image} from 'react-native';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {ActivityIndicator} from 'react-native';
import {useDispatch} from 'react-redux';
import CartItemQuantity from './CartItemQuantity';

const CartItem = ({item}) => {
  const dispatch = useDispatch();

  const cartItem = item?.item;
  // console.log(cartItem);
  const [attributes, setAttributes] = useState([]);
  const [productImage, setProductImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';
  // const cartId = '2d0daf14-f500-5ea7-9425-7f6254ef5ae0';

  const cartId = 'cdb36660-2eb0-5808-a2d8-74bdec08ca19';
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
          // console.log(
          //   'res',
          //   res?.data?.data?.data[0]?.attributes?.imageSets[0]?.images[0]
          //     ?.externalUrlSmall,
          // );
        });
    };
    getProductImage();
  }, [cartItem]);

  const removeItem = async itemId => {
    setIsLoading(true);
    const response = await api
      .Delete(`carts/${cartId}/items/${itemId}`)
      .then(res => {
        if (res.data.status == 204) {
          dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(
            () => {
              setIsLoading(false);
            },
          );
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
        <Box width={'30%'}>
          <Image
            style={{width: '100%', height: 70}}
            source={{
              uri: productImage,
            }}
          />
        </Box>

        <Box width={'40%'} marginLeft="s8">
          <Text>{attributes?.name}</Text>
        </Box>
        <Box width={'30%'} alignItems="flex-end">
          <Box flexDirection="row">
            <TouchableOpacity onPress={() => removeItem(cartItem.itemId)}>
              <Text>Remove Item</Text>
            </TouchableOpacity>
          </Box>
          <CartItemQuantity cartItem={cartItem} />
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem;
