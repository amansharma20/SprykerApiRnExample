import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductListScreen = props => {
  const { nodeId } = props.route.params;
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const getProducts = async () => {
    console.warn("node Id", nodeId);
    setIsLoading(true);
    const resp = await fetch(
      `https://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?category=${nodeId}&page[offset]=${pageOffset}&page[limit]=12`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();
    setProducts([...products, ...result?.data[0]?.attributes?.abstractProducts]);
    setPageOffset(pageOffset + 12);
    setIsLoading(false);
    setLastPage(result?.data[0]?.attributes?.pagination.maxPage);
    setCurrentPage(result?.data[0]?.attributes?.pagination.currentPage);
    console.warn('maxPage---', result?.data[0]?.attributes?.pagination.maxPage);
    console.warn('currentPage---', result?.data[0]?.attributes?.pagination.currentPage);
  };
  useEffect(() => {
    getProducts();
  }, [nodeId]);

  const loadMore = () => {
    if (currentPage <= lastPage) {
      getProducts();
    }
  }

  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image
        source={{ uri: item?.images[0]?.externalUrlSmall }}
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
        <TouchableOpacity style={styles.roundButton2}>
          <Text style={{ color: 'white' }}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Products</Text>
      <Button
        title="go back"
        onPress={() => navigation.navigate('Home')}
      />

      {isLoading && <ActivityIndicator />}
      <FlatList
        data={products}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.productList}
        onEndReached={loadMore}
        onEndReachedThreshold={1}
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
  button: {
    borderRadius: 14,
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
});

export default ProductListScreen;
