import {Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box} from '@atoms';

export default function ProductItem({item}) {
  const navigation = useNavigation();
  return (
    <Box
      flex={1}
      marginHorizontal="s4"
      flexShrink={1}
      mb="s8"
      borderWidth={1}
      borderColor="border"
      borderRadius={8}
      padding="s4">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductDetailsScreen', {
            product: item,
          });
        }}>
        <Box alignItems="center">
          <Image
            source={{uri: item?.images[0]?.externalUrlSmall}}
            style={styles.productImage}
          />
        </Box>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.abstractName}
        </Text>
        <Box>
          <Text style={styles.productPrice}>$ {item.price}</Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}

const styles = StyleSheet.create({
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
    backgroundColor: 'white',
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
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
