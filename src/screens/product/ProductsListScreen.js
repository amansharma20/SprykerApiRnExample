import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ProductListScreen = props => {
  const {nodeId} = props.route.params;
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      const resp = await fetch(
        `https://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search?category=${nodeId}`,
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
    getProducts();
  }, [nodeId]);
  console.log('first', products);

  const navigation = useNavigation();
  const renderItem = ({item}) => (
    // console.warn(item.images[0]?.externalUrlSmall)
    <TouchableOpacity style={styles.productContainer} onPress={() => {
      navigation.navigate('ProductDetailsScreen', {
        product: item,
      });
    }}>
    // console.log(item.images[0]?.externalUrlSmall)
    {/* <View style={styles.productContainer}> */}
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
        <TouchableOpacity style={styles.roundButton2}>
          <Text style={{color: 'white'}}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.row}>
      <TouchableOpacity
        style={styles.registerButton1}
        onPress={() => navigation.goBack()}
      >
        <Image
          style={styles.logo}
          source={require("../../assets/images/backButton.png")}
        />
      </TouchableOpacity>
      <Text style={styles.title}>All Products</Text>
      </View>
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
  productContainer: {
    flex: 0.5,
    alignItems: 'center',
    marginBottom: 16,
  }, registerButton1: {
    width: "20%",
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  logo: {
    height: 30,
    resizeMode: "contain",
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
  row:{
    display:'flex',
    flexDirection:"row"
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
