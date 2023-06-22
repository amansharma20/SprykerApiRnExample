import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function ProductItem({item}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => {
        navigation.navigate('ProductDetailsScreen', {
          product: item,
        });
      }}>
      <Image
        source={{uri: item?.images[0]?.externalUrlSmall}}
        style={styles.productImage}
      />
      <Text style={styles.productTitle}>{item.abstractName}</Text>
      <View
        style={{
          flex: 2,
          flexDirection: 'row',
          marginLeft: 20,
          justifyContent: 'space-between',
          width: '80%',
        }}>
        <Text style={styles.productPrice}>$ {item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flex: 0.5,
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  roundButton2: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'red',
    color: 'white',
  },
  button: {
    borderRadius: 14,
  },
});
