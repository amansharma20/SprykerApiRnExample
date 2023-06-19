/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import {Box, Text} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {api} from '../../api/SecureAPI';
import {useFocusEffect} from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productDetails, setProductDetails] = useState([]);

  const dispatch = useDispatch();

  // const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';
  const cartId = '2d0daf14-f500-5ea7-9425-7f6254ef5ae0';

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );

  let customerItemDetailsNew = [];

  function isKeyUnique(array, key) {
    return array.every(obj => obj.key !== key);
  }

  const getCartProductDetails = async () => {
    if (customerCartData.length > 0) {
      customerCartData?.forEach(async item => {
        // const wait = new Promise(resolve => setTimeout(resolve, 1000));
        // wait.then(async () => {
        // setListOfFunds(response?.data?.data);
        await api.get(`concrete-products/${item.sku}`).then(async res => {
          if (res.data.status === 200) {
            const key = res.data.data.data.id;
            if (isKeyUnique(customerItemDetailsNew, key)) {
              customerItemDetailsNew.push(res.data.data.data);
              const responses = await Promise.all(customerItemDetailsNew);
              console.log('responses: ', responses.length);
              setProductDetails(responses);
            } else {
              // console.log('Object skipped due to duplicate key:', object);
            }
          }
        });
        // });
      });
    }
  };

  const renderItem = ({item}) => {
    console.log('item: ', item);
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
            <Text numberOfLines={2} variant="semiBold16" lineHeight={20}>
              {item.attributes.name}
            </Text>
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

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    getCartProductDetails();
  }, [customerCartData.length]);

  // useFocusEffect(
  //   useCallback(() => {
  //     setIsLoading(true);
  //     dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(
  //       () => {
  //         setIsLoading(false);
  //         getCartProductDetails();
  //       },
  //     );
  //   }, [customerCartData.length]),
  // );

  return (
    <Box flex={1}>
      <CommonHeader title={'Your Cart'} />
      <Box paddingHorizontal="paddingHorizontal">
        <FlatList
          data={productDetails}
          // data={customerItemDetailsNew}
          renderItem={renderItem}
        />
      </Box>
    </Box>
  );
};
export default CartScreen;
