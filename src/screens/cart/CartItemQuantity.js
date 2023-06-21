import React, {useEffect, useState} from 'react';
import {api} from '../../api/SecureAPI';
import {Box, Text} from '@atoms';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {ActivityIndicator} from 'react-native';
import {useDispatch} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';

const CartItemQuantity = ({cartItem}) => {
  const cartId = 'cdb36660-2eb0-5808-a2d8-74bdec08ca19';
  const dispatch = useDispatch();
  const changeQuantity = async (itemId, count, sku) => {
    console.log('my console here');
    console.log('itemId', itemId);
    console.log('quantity', count);
    console.log('sku', sku);
    let userToken = await Keychain.getGenericPassword();
    let token = userToken.password;
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
    console.log(productCart);
    const resp = await api.patch(
      `carts/${cartId}/items/${itemId}`,
      JSON.stringify(productCart),
    );
    console.log(resp);
    if (resp.status === 401) {
      return;
    }
    const response = resp.data;
    if (response) {
      dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(
        () => {
          console.log('done');
        },
      );
    } else {
      console.log('error');
    }
  };
  return (
    <Box flexDirection="row" marginTop="s20">
      <TouchableOpacity
        disabled={cartItem.quantity === 1}
        onPress={() =>
          cartItem.quantity >= 1 &&
          changeQuantity(
            cartItem?.itemId,
            cartItem?.quantity - 1,
            cartItem?.sku,
          )
        }
        style={styles.quantityButton}>
        <Text style={styles.quantityText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{cartItem.quantity}</Text>
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
    backgroundColor: 'lightgray',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  quantityText: {
    fontWeight: '500',
    fontSize: 30,
    color: 'white',
  },
  quantity: {
    fontWeight: '500',
    fontSize: 20,
    marginHorizontal: 10,
    marginTop: 6,
  },
});

export default CartItemQuantity;
