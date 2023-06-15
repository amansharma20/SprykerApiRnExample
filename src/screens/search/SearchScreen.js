import React, {useState} from 'react';
import {View, TextInput, StyleSheet, FlatList} from 'react-native';
import ProductItem from '../../components/ProductItem';

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
