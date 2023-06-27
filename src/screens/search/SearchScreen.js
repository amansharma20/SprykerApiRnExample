import React, {useState} from 'react';
import {View, TextInput, StyleSheet, FlatList} from 'react-native';
import ProductItem from '../../components/ProductItem';
import {SearchIcon} from '../../assets/svgs';
import {applicationProperties} from '../../utils/application.properties';
const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const resp = await fetch(
      `${applicationProperties.baseUrl}catalog-search-suggestions?q=${searchText}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const result = await resp.json();
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
      <View style={styles.searchContainer}>
        <SearchIcon />
        <TextInput
          style={styles.input}
          placeholder="Search for Products, Brands and More"
          value={searchText}
          onChangeText={setSearchText}
          onChange={handleSearch}
          autoFocus={true}
        />
      </View>
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
    backgroundColor: 'white',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 4,
    color: '#333',
  },
  resultsContainer: {
    marginTop: 16,
  },
  productList: {
    justifyContent: 'space-between',
  },
});

export default SearchScreen;
