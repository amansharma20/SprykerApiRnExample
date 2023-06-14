import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductListScreen = props => {
  const { nodeId } = props.route.params;
  const [products, setProducts] = useState([]);
  const [currentPageOffset, setCurrentPageOffset] = useState(0);
  const [lastOffset, setLastOffset] = useState(0);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const resp = await fetch(
          `https://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?category=${nodeId}&page[offset]=${currentPageOffset}&page[limit]=12`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        );
        console.warn(resp);
        const result = await resp.json();

        if (result?.data && result.data.length > 0 && result.data[0].attributes?.abstractProducts) {
          setProducts([...products, result?.data[0]?.attributes?.abstractProducts]);
          console.warn('result---', result?.data[0]?.attributes?.abstractProducts);
        } else {
          setProducts([result?.data[0]?.attributes?.abstractProducts]);
        }
        if (result?.links?.last) {
          console.warn('last---', result.links.last);
        }
      } catch (error) {
        console.warn("something error");
      }
    };
    getProducts();
  }, [nodeId, currentPageOffset]);
  console.warn('first', products);

  const navigation = useNavigation();
  const loadMoreItem = () => {
    setCurrentPageOffset(currentPageOffset + 12);
  };
  const renderItem = ({ item }) => (
    // console.warn(item.images[0]?.externalUrlSmall)
    <View style={styles.productContainer}>
      {/* <Image
        source={{ uri: item?.images[0]?.externalUrlSmall }}
        style={styles.productImage}
      /> */}
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
      <FlatList
        data={products}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.productList}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0}
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
