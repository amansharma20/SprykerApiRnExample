import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Button, FlatList} from 'react-native';
import {Box, Text} from '@atoms';
import {useSelector, useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import CartItem from './CartItem';
import {useNavigation} from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [cartItemsArray, setCartItemsArray] = useState([]);

  const dispatch = useDispatch();

  const customerCartId = useSelector(
    state =>
      state.customerCartIdApiSlice?.customerCart?.data?.data?.[0]?.id || '',
  );

  const customerCartData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.customerCart || [],
  );
  console.log('customerCartData: ', customerCartData.length);

  useEffect(() => {
    if (customerCartData.length !== 0 && customerCartId) {
      let tempArr = [];
      customerCartData?.map(item => {
        tempArr.push(item.itemId);
      });
      setCartItemsArray(tempArr);
      setIsLoading(false);
    }
  }, [customerCartData, customerCartId]);

  useEffect(() => {
    setIsLoading(true);
    if (customerCartId) {
      dispatch(
        getCustomerCartItems(`carts/${customerCartId}?include=items`),
      ).then(() => {
        console.log('HERE');
        setIsLoading(false);
      });
    }
  }, [dispatch, customerCartId]);

  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={'Your Cart'} />
      {isLoading ? (
        <>
          <ActivityIndicator />
        </>
      ) : (
        <>
          <Box flex={1} paddingHorizontal="paddingHorizontal">
            <FlatList
              data={customerCartData}
              renderItem={item => {
                return <CartItem item={item} />;
              }}
              contentContainerStyle={{paddingBottom: 100}}
              ListEmptyComponent={() => {
                return (
                  <Box flex={1}>
                    <Text>text</Text>
                  </Box>
                );
              }}
            />
            {customerCartData?.length !== 0 ? (
              <>
                <Button
                  title="Proceed to Checkout"
                  onPress={() =>
                    navigation.navigate('CheckoutScreen', {
                      cartId: customerCartId,
                      cartItemsArray: cartItemsArray,
                    })
                  }
                />
              </>
            ) : (
              <></>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
export default CartScreen;
