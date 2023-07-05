/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import Box from '../../atoms/box';
import Text from '../../atoms/text';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useSelector, useDispatch} from 'react-redux';
import {getProductsByWishlistAsyncThunk} from '../../redux/wishlist/ProductsWishlistApiAsyncThunk';
import {FlatList} from 'react-native-gesture-handler';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {RemoveIcon} from '../../assets/svgs';
import {getCustomerWishlist} from '../../redux/wishlist/GetWishlistApiAsyncThunk';
import {api} from '../../api/SecureAPI';
import WishListItemQuantityScreen from './WishListItemQuantityScreen';

const WishlistItemsScreen = props => {
  const dispatch = useDispatch();
  const wishlistId = props.route.params.id;
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const productsByWishlist = useSelector(
    state =>
      state?.getProductsByWishlistApiSlice?.productsByWishlist?.data || [],
  );

  useEffect(() => {
    const productIds = [];

    productsByWishlist?.included?.forEach(element => {
      if (element.type == 'concrete-products') {
        productIds.push({
          id: element.id,
        });
      }
    });
    // console.log('productIds: ', productIds);
  }, [productsByWishlist]);

  const prepDataForFlatList = async () => {
    if (productsByWishlist?.included?.length > 0) {
      const concreteProductData = [];
      const image = [];
      const quantity = [];
      const price = [];

      productsByWishlist.included.forEach(element => {
        console.log('element123456789: ', element);
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
              itemId: element.id,
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

      const shoppingItems = () =>
        quantity.map(concreteProduct => {
          const matchingImage = image.find(
            img => img.id === concreteProduct.id,
          );
          const matchingQuantity = quantity.find(
            qty => qty.id === concreteProduct.id,
          );
          const matchingPrice = price.find(
            prc => prc.id === concreteProduct.id,
          );

          return {
            id: concreteProduct.id,
            name: concreteProduct.name,
            image: matchingImage?.image,
            quantity: matchingQuantity?.quantity || 0,
            price: matchingPrice?.price || 0,
            itemId: matchingQuantity.itemId,
          };
        });

      setFilteredProducts(shoppingItems());
    }
  };

  useEffect(() => {
    prepDataForFlatList();
  }, [productsByWishlist]);

  const renderItem = item => {
    const product = item.item;
    return (
      <Box
        flex={1}
        flexDirection="row"
        marginHorizontal="s4"
        flexShrink={1}
        mb="s8"
        borderWidth={1}
        borderColor="border"
        borderRadius={8}
        padding="s8">
        <Box flex={1} alignItems="center">
          <TouchableOpacity>
            <Image source={{uri: product?.image}} style={styles.productImage} />
          </TouchableOpacity>
        </Box>

        <Box flex={2} paddingLeft="s4" justifyContent="space-between">
          <Box>
            <Text style={styles.productTitle} numberOfLines={2}>
              {product?.name}
            </Text>
            <Text style={styles.productPrice}>$ {product?.price}</Text>
            <Text style={styles.productPrice}>
              Quantity : {product?.quantity}
            </Text>
          </Box>

          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <TouchableOpacity
              onPress={() => removeItemFromShoppingList(product.itemId)}>
              <Text>
                <RemoveIcon />
              </Text>
            </TouchableOpacity>

            <WishListItemQuantityScreen
              shoppingListId={wishlistId}
              shoppingListItemId={product.itemId}
              productSku={product.id}
              quantity={product?.quantity}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  const removeItemFromShoppingList = async itemId => {
    setIsLoading(true);
    const response = await api
      .Delete(`shopping-lists/${wishlistId}/shopping-list-items/${itemId}`)
      .then(res => {
        if (res.data.status == 204) {
          dispatch(
            getProductsByWishlistAsyncThunk(
              `shopping-lists/${wishlistId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
            ),
          );
          dispatch(getCustomerWishlist('shopping-lists')).then(() => {
            setIsLoading(false);
          });
        }
      });
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getProductsByWishlistAsyncThunk(
        `shopping-lists/${wishlistId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      ),
    ).then(() => {
      setIsLoading(false);
    });
  }, [wishlistId]);

  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title="Items" />
      {isLoading ? (
        <>
          <ActivityIndicator />
        </>
      ) : (
        <>
          <FlatList data={filteredProducts} renderItem={renderItem} />
        </>
      )}
    </Box>
  );
};
const styles = StyleSheet.create({
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain', // Adjust the image resize mode based on your requirement
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
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
