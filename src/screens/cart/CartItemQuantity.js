import React, {useEffect, useState} from 'react';
import {api} from '../../api/SecureAPI';
import {Box, Text} from '@atoms';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';

const CartItemQuantity = ({cartItem, removeItemTrigger}) => {
  const [isloading, setIsLoading] = useState(false);
  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );
  const dispatch = useDispatch();
  const changeQuantity = async (itemId, count, sku) => {
    setIsLoading(true);

    const productCart = {
      data: {
        type: 'items',
        attributes: {
          sku: sku,
          quantity: count,
          salesUnit: {
            id: 0,
            amount: 0,
          },
          productOptions: [null],
        },
      },
    };
    const resp = await api.patch(
      `carts/${customerCart.id}/items/${itemId}`,
      JSON.stringify(productCart),
    );
    const response = resp.data;
    if (response) {
      dispatch(
        getCustomerCartItems(`carts/${customerCart.id}?include=items`),
      ).then(error => {
        setIsLoading(false);
      });
    } else {
    }
  };
  return (
    <Box flexDirection="row" marginTop="s20">
      <TouchableOpacity
        onPress={() =>
          cartItem.quantity > 1
            ? changeQuantity(
                cartItem?.itemId,
                cartItem?.quantity - 1,
                cartItem?.sku,
              )
            : removeItemTrigger(cartItem?.itemId)
        }
        style={styles.quantityButton}>
        <Text style={styles.quantityText}>-</Text>
      </TouchableOpacity>
      {isloading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.quantity}>{cartItem.quantity}</Text>
      )}
      <TouchableOpacity
        onPress={() =>
          changeQuantity(cartItem.itemId, cartItem.quantity + 1, cartItem?.sku)
        }
        style={styles.quantityButton}>
        <Text style={styles.quantityText}>+</Text>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  quantityButton: {
    // backgroundColor: 'lightgray',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  quantityText: {
    fontWeight: '300',
    fontSize: 30,
    color: 'black',
  },
  quantity: {
    fontWeight: '500',
    fontSize: 20,
    marginHorizontal: 10,
    marginTop: 6,
  },
});

export default CartItemQuantity;
