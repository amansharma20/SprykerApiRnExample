import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ProductItem from '../../components/ProductItem';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {theme} from '../../atoms/theme';

const ProductListScreen = props => {
  const {nodeId, title} = props.route.params;
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);

  const getProducts = async () => {
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

    setProducts([
      ...products,
      ...result?.data[0]?.attributes?.abstractProducts,
    ]);
    setPageOffset(pageOffset + 12);
    setIsLoading(false);
    setLastPage(result?.data[0]?.attributes?.pagination.maxPage);
    setCurrentPage(result?.data[0]?.attributes?.pagination.currentPage);
  };

  useEffect(() => {
    getProducts();
  }, [nodeId]);

  const loadMore = () => {
    if (currentPage <= lastPage) {
      getProducts();
    }
  };

  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <>
      <ProductItem item={item} />
    </>
  );

  return (
    <View style={styles.container}>
      <CommonHeader title={title || 'All Products'} />
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
    backgroundColor: theme.colors.background,
    // padding: 16,
  },

  productList: {
    // justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default ProductListScreen;
