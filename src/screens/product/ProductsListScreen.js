import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function ProductsListScreen(props) {
  const {nodeId} = props.route.params;

  const [isSubCategoryLoading, setIsSubCategoryLoading] = useState(true);
  const [categoryProductsData, setCategoryProductsData] = useState([]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity>
        <View style={styles.container}>
          <Image
            source={{uri: item.images[0]?.externalUrlSmall}}
            style={styles.image}
          />
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.price}>
            {item.prices[0]?.currency?.symbol}
            {item?.prices[0]?.grossAmount}
          </Text>
          <Text style={styles.price}>{item.abstractName}</Text>
          {/* <Text style={styles.description}>{product.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setIsSubCategoryLoading(true);
    async function getCategoryProducts() {
      try {
        const response = await axios.get(
          `https://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?category=${nodeId}`,
        );
        if (response.status === 200) {
          setCategoryProductsData(
            response.data.data[0]?.attributes?.abstractProducts,
          );
          setIsSubCategoryLoading(false);
        } else {
          setIsSubCategoryLoading(false);
        }
      } catch (error) {
        console.log('An error occurred while fetching categories:', error);
        setIsSubCategoryLoading(false);
      }
    }

    getCategoryProducts();
  }, [nodeId]); // Or [] if effect doesn't need props or state

  return (
    <View>
      <FlatList
        data={categoryProductsData}
        renderItem={renderItem}
        // key={item?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
