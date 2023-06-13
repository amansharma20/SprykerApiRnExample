import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

// Dummy product data
const allProducts = [
  {id: 1, title: 'Product 1'},
  {id: 2, title: 'Product 2'},
  {id: 3, title: 'Product 3'},
  {id: 4, title: 'Product 4'},
  // Add more products here
];

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const resp = await fetch(
      `https://glue.de.faas-suite-prod.cloud.spryker.toys/catalog-search-suggestions?q=${searchText}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();
    console.log(
      result?.data[0]?.attributes?.abstractProducts,
      'result based on search',
    );

    setSearchResults(result?.data[0]?.attributes?.abstractProducts);
    // const filteredResults = allProducts.filter(product =>
    //   product.title.toLowerCase().includes(searchText.toLowerCase()),
    // );
    // setSearchResults(filteredResults);
  };

  const renderProductItem = ({item}) => (
    // <Text style={styles.productItem}>{item.abstractName}</Text>
    <TouchableOpacity
      style={styles.productContainer}
      // onPress={() => {
      //   console.log('item: ', item);
      //   navigation.navigate('ProductDetailsScreen', {product: item});
      // }}
    >
      {/* <Image
        source={item?.images[0]?.externalUrlSmall}
        style={styles.productImage}
      /> */}
      <Text style={styles.productTitle}>{item?.abstractName}</Text>
      <Text style={styles.productPrice}>{item?.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />
      {searchResults.length === 0 && (
        <FlatList
          data={allProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.abstractSku}
          style={styles.resultsContainer}
        />
      )}
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderProductItem}
          keyExtractor={item => item.abstractSku}
          style={styles.resultsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resultsContainer: {
    marginTop: 16,
  },
  productItem: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default SearchScreen;
