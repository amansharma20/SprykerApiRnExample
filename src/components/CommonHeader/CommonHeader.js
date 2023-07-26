/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, theme} from '@atoms';
import GoBackButton from '../GoBackButton/GoBackButton';
import {CartIcon} from '../../assets/svgs';
import {useGoToCart} from '../../hooks/useGoToCart';
import {useSelector} from 'react-redux';
// import GoBackButton from './GoBackButton/GoBackButton';

const CommonHeader = ({title, onPress, showCartIcon = false, ...props}) => {
  const {goToCart} = useGoToCart();

  const customerCartDataNew = useSelector(
    state => state.getCartDataNewApiSlice?.cartDataNew.data,
  );

  function getTotalNormalProductsQuantity(arrayOfObjects) {
    // Step 1: Use map() to extract an array of quantities
    const quantities = arrayOfObjects?.map(
      obj => obj?.itemData?.attributes?.quantity,
    );

    // Step 2: Use reduce() to sum up the quantities
    const totalQuantity = quantities?.reduce(
      (accumulator, currentQuantity) => accumulator + currentQuantity,
      0,
    );

    return totalQuantity;
  }

  function getTotalConfiguredProductsQuantity(arrayOfObjects) {
    // Step 1: Use map() to extract an array of quantities
    const quantities = arrayOfObjects?.map(obj => obj?.groupquantity);

    // Step 2: Use reduce() to sum up the quantities
    const totalQuantity = quantities?.reduce(
      (accumulator, currentQuantity) => accumulator + currentQuantity,
      0,
    );

    return totalQuantity;
  }

  const cartItemsCount =
    getTotalNormalProductsQuantity(customerCartDataNew?.normalProduct) +
      getTotalConfiguredProductsQuantity(
        customerCartDataNew?.configureBundle,
      ) || null;

  // const cartItemsCount = useSelector(
  //   state => state.getCustomerCartItemsAliSlice.itemsCount,
  // );

  const onPressCart = () => {
    goToCart();
  };

  return (
    <Box flexDirection="row">
      <SafeAreaView style={styles.container} {...props}>
        <Box flexDirection="row" alignItems="center" maxWidth={'80%'}>
          <GoBackButton onPress={onPress} />
          <Text variant="bold18" style={{maxWidth: '90%'}} numberOfLines={1}>
            {title}
          </Text>
        </Box>
        {showCartIcon && (
          <>
            <TouchableOpacity
              style={styles.cartContainer}
              onPress={onPressCart}>
              {cartItemsCount !== null ? (
                <>
                  <Box
                    style={{
                      backgroundColor: '#F50157',
                      zIndex: 2,
                      position: 'absolute',
                      alignItems: 'center',
                      width: 16,
                      height: 16,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      borderRadius: 100,
                      marginLeft: 16,
                    }}>
                    <Text fontSize={12} fontWeight="700">
                      {cartItemsCount ?? 0}
                    </Text>
                  </Box>
                </>
              ) : (
                <></>
              )}
              <CartIcon />
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    </Box>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.paddingHorizontal,
    marginBottom: theme.spacing.s8,
    justifyContent: 'space-between',
    flexShrink: 1,
    width: '100%',
  },
  cartContainer: {
    padding: 6,
  },
});
