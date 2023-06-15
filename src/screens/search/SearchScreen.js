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
import {useNavigation} from '@react-navigation/native';
import ProductItem from '../../components/ProductItem';

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
  console.log('searchResults: ', searchResults);
  const navigation = useNavigation();

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

  const renderProductItem = ({item}) => {
    console.log('item: ', item);
    return (
      <>
        <ProductItem item={item} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchText}
        onChangeText={setSearchText}
        onChange={handleSearch}
      />
      {/* <Button title="Search" onPress={handleSearch} /> */}
      {/* {searchResults.length === 0 && (
        <FlatList
          data={allProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.abstractSku}
          style={styles.resultsContainer}
        />
      )} */}
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderProductItem}
          keyExtractor={item => item.abstractSku}
          numColumns={2}
          contentContainerStyle={styles.productList}
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
  productList: {
    justifyContent: 'space-between',
  },
});

export default SearchScreen;
