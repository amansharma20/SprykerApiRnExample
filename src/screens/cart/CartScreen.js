/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import {Box} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {api} from '../../api/SecureAPI';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import CartItem from './CartItem';

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productDetails, setProductDetails] = useState([]);

  const dispatch = useDispatch();

  // const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';
  const cartId = '2d0daf14-f500-5ea7-9425-7f6254ef5ae0';

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [{}],
  );

  let customerItemDetailsNew = [];

  function isKeyUnique(array, key) {
    return array.every(obj => obj.key !== key);
  }

  // const getCartProductDetails = async () => {
  //   if (customerCartData.length > 0) {
  //     customerCartData?.forEach(async item => {
  //       await api.get(`concrete-products/${item.sku}`).then(async res => {
  //         if (res.data.status === 200) {
  //           const key = res.data.data.data.id;
  //           if (isKeyUnique(customerItemDetailsNew, key)) {
  //             customerItemDetailsNew.push(res.data.data.data);
  //             const responses = await Promise.all(customerItemDetailsNew);
  //             if (responses) {
  //               console.log('responses: ', responses.length);
  //             }
  //             setProductDetails(responses);
  //           } else {
  //             // console.log('Object skipped due to duplicate key:', object);
  //           }
  //         }
  //       });
  //       // });
  //     });
  //   }
  // };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(() => {
      setIsLoading(false);
    });
  }, []);

  // useEffect(() => {
  //   getCartProductDetails();
  // }, []);

  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={'Your Cart'} />
      <Box paddingHorizontal="paddingHorizontal">
        <FlatList
          data={customerCartData}
          renderItem={item => {
            return <CartItem item={item} />;
          }}
          contentContainerStyle={{paddingBottom: 100}}
        />
      </Box>
    </Box>
  );
};
export default CartScreen;
