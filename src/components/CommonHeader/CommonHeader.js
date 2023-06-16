import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, theme} from '@atoms';
import GoBackButton from '../GoBackButton/GoBackButton';
import {useDispatch, useSelector} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
// import GoBackButton from './GoBackButton/GoBackButton';
import {CartIcon} from '../../assets/svgs';
const CommonHeader = ({title, onPress, ...props}) => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';
  const cartItemsData = useSelector(
    state => state.getCustomerCartItemsAliSlice?.cartItems?.data || [],
  );
  useEffect(() => {
    setIsLoading(true);
    dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    var count = 0;
    cartItemsData?.included?.map(item => {
      count += item.attributes.quantity;
    });
    setTotalQuantity(count);
  }, [cartItemsData]);
  console.log(totalQuantity, 'total quantity');
  return (
    <SafeAreaView style={styles.container} {...props}>
      <GoBackButton onPress={onPress} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text variant="bold18" style={{width: '80%'}} numberOfLines={1}>
          {title}
        </Text>
        <Text>
          <CartIcon />
          <Text style={styles.count}>{totalQuantity}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.paddingHorizontal,
    marginBottom: theme.spacing.s8,
  },
});
