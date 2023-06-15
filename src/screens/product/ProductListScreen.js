import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ProductItem from '../../components/ProductItem';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    const resp = await fetch(
      'https://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();
    setProducts(result?.data[0]?.attributes?.abstractProducts);
    console.log('result---', result?.data[0]?.attributes?.abstractProducts);
  };
  useEffect(() => {
    getProducts();
  }, []);
  console.log('first', products);

  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <>
      <ProductItem item={item} />
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Products</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productList: {
    justifyContent: 'space-between',
  },
});

export default ProductListScreen;
