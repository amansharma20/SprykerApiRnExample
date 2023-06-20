import React, {useEffect, useState} from 'react';
import {api} from '../../api/SecureAPI';
import {Box, Text} from '@atoms';
import {TouchableOpacity} from 'react-native';

const CartItem = ({item}) => {
  const cartItem = item?.item;
  const [attributes, setAttributes] = useState([]);
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
  }, [cartItem]);

  return (
    <Box
      borderRadius={8}
      borderColor="border"
      borderWidth={1}
      mb="s8"
      padding="s16">
      <Box flexDirection="row">
        <Box width={'10%'}>
          <Text>productImage</Text>
        </Box>

        <Box width={'70%'} marginLeft="s8">
          <Text>{attributes?.name}</Text>
        </Box>
        <Box width={'20%'} alignItems="flex-end">
          <TouchableOpacity onPress={() => {}}>
            <Text>delete icon</Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem;
