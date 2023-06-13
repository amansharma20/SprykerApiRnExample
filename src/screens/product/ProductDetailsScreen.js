import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

// Dummy product data
// const product = {
//   id: 1,
//   title: 'Product 1',
//   price: '$9.99',
//   description:
//     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum ipsum nec aliquam euismod.',
//   image: require('../../assets/images/product1.jpeg'),
// };

const ProductDetailsScreen = props => {
  const product = props.route.params.product;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Details</Text>
      <Image source={product.image} style={styles.productImage} />
      <Text style={styles.productTitle}>{product.title}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;
