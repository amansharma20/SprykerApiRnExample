import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import CategorySection from './categorySection/CategorySection';

// Dummy product data
const products = [
  {
    id: 1,
    title: 'Product 1',
    price: '$9.99',
    image: require('../../assets/images/product1.jpeg'),
  },
  {
    id: 2,
    title: 'Product 2',
    price: '$19.99',
    image: require('../../assets/images/product1.jpeg'),
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <CategorySection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productList: {
    justifyContent: 'space-between',
  },
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
});

export default HomeScreen;
