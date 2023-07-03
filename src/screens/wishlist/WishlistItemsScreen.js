import React, {useEffect, useState} from 'react';
import Box from '../../atoms/box';
import Text from '../../atoms/text';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useSelector, useDispatch} from 'react-redux';
import {getProductsByWishlistAsyncThunk} from '../../redux/wishlist/ProductsWishlistApiAsyncThunk';
import {FlatList} from 'react-native-gesture-handler';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

const WishlistItemsScreen = props => {
  const dispatch = useDispatch();
  const wishlistId = props.route.params.id;
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productsByWishlist = useSelector(
    state =>
      state?.getProductsByWishlistApiSlice?.productsByWishlist?.data || [],
  );
  useEffect(() => {
    if (
      productsByWishlist &&
      productsByWishlist.included &&
      productsByWishlist.included.length > 0
    ) {
      const concreteProductData = [];
      const image = [];
      const quantity = [];
      const price = [];

      productsByWishlist.included.forEach(element => {
        switch (element.type) {
          case 'concrete-products':
            concreteProductData.push({
              id: element.id,
              name: element.attributes.name,
            });
            break;

          case 'concrete-product-image-sets':
            image.push({
              id: element.id,
              image:
                element?.attributes?.imageSets[0]?.images[0]?.externalUrlLarge,
            });
            break;

          case 'shopping-list-items':
            quantity.push({
              quantity: element.attributes.quantity,
              id: element.attributes.sku,
            });
            break;

          default:
            price.push({
              price: element.attributes.price,
              id: element.id,
            });
            break;
        }
      });

      const shoppingItems = concreteProductData.map(concreteProduct => {
        const matchingImage = image.find(img => img.id === concreteProduct.id);
        const matchingQuantity = quantity.find(
          qty => qty.id === concreteProduct.id,
        );
        const matchingPrice = price.find(prc => prc.id === concreteProduct.id);

        return {
          id: concreteProduct.id,
          name: concreteProduct.name,
          image: matchingImage?.image,
          quantity: matchingQuantity?.quantity || 0,
          price: matchingPrice?.price || 0,
        };
      });

      setFilteredProducts(shoppingItems);
    }
  }, [productsByWishlist]);

  const renderItem = item => {
    const product = item.item;
    return (
      <Box
        flex={1}
        marginHorizontal="s4"
        flexShrink={1}
        mb="s8"
        borderWidth={1}
        borderColor="border"
        borderRadius={8}
        padding="s8">
        <TouchableOpacity>
          <Box alignItems="center">
            <Image source={{uri: product?.image}} style={styles.productImage} />
          </Box>

          <Box alignItems="center">
            <Text style={styles.productTitle} numberOfLines={2}>
              {product?.name}
            </Text>
          </Box>

          <Box alignItems="center">
            <Text style={styles.productPrice}>$ {product?.price}</Text>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  };

  useEffect(() => {
    dispatch(
      getProductsByWishlistAsyncThunk(
        `shopping-lists/${wishlistId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      ),
    );
  }, [wishlistId]);
  return (
    <Box>
      <CommonHeader title="Items" />
      {filteredProducts.length > 0 ? (
        <FlatList data={filteredProducts} renderItem={renderItem} />
      ) : (
        ''
      )}
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
  roundButton2: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'red',
    color: 'white',
  },
  button: {
    borderRadius: 14,
  },
});

export default WishlistItemsScreen;
