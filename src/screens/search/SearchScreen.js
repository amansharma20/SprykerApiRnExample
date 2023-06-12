import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Text,
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

  const handleSearch = () => {
    const filteredResults = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchText.toLowerCase()),
    );
    setSearchResults(filteredResults);
  };

  const renderProductItem = ({item}) => (
    <Text style={styles.productItem}>{item.title}</Text>
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
          keyExtractor={item => item.id.toString()}
          style={styles.resultsContainer}
        />
      )}
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
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
