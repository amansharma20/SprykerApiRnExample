import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {applicationProperties} from '../../utils/application.properties';
import {commonApi} from '../../api/CommanAPI';
const BundledProductsListScreen = props => {
  const navigation = useNavigation();

  const title = props.route.params?.title;
  const [bundeledProductIds, setBundeledProductIds] = useState([
    210, 211, 212, 214,
  ]);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const BundleProductItem = ({item}) => {
    // console.log('items111111: ', item);
    const productItem = item.item;
    const productImage =
      item?.item?.[0]?.included?.[0]?.attributes.imageSets?.[0]?.images?.[0]
        ?.externalUrlSmall;
    console.log('productImage: ', productImage);
    console.log('item: ', productItem[0]?.data?.attributes?.name);
    return (
      <Box>
        <Box
          flex={1}
          marginHorizontal="s4"
          flexShrink={1}
          mb="s8"
          borderWidth={1}
          borderColor="border"
          borderRadius={8}
          padding="s8">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BundleProductDetailsScreen', {
                bundleProduct: productItem,
              });
            }}>
            <Box alignItems="center">
              <Image source={{uri: productImage}} style={styles.productImage} />
            </Box>
            <Text style={styles.productTitle} numberOfLines={2}>
              {productItem[0]?.data?.attributes?.name}
            </Text>
            {/* 
            <Box>
              <Text style={styles.productPrice}>$ {item.price}</Text>
            </Box> */}
          </TouchableOpacity>
        </Box>
      </Box>
    );
  };
  const renderItem = items => {
    return (
      <>
        <BundleProductItem item={items} />
      </>
    );
  };

  useEffect(() => {
    setBundleProducts([]);
    const getBundeledProducts = async id => {
      setIsLoading(true);
      const response = await commonApi.get(
        `abstract-products/${id}?include=abstract-product-image-sets`,
      );
      // console.log('response: ', response?.data?.data);
      setBundleProducts(prevBundleProducts => [
        ...prevBundleProducts,
        [response?.data?.data],
      ]);

      setIsLoading(false);
    };
    bundeledProductIds.map(id => {
      getBundeledProducts(id);
    });
  }, []);
  console.log('bundleProducts', bundleProducts.length);
  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={title} />
      <Box flex={1} paddingHorizontal="paddingHorizontal">
        {/* <Text>BundledProductsListScreen</Text> */}
        {!isLoading ? (
          <>
            <FlatList
              data={bundleProducts}
              renderItem={renderItem}
              numColumns={2}
            />
          </>
        ) : (
          <>
            <ActivityIndicator />
          </>
        )}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
    backgroundColor: 'white',
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
});
export default BundledProductsListScreen;
