/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {commonApi} from '../../api/CommanAPI';
import {api} from '../../api/SecureAPI';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Box, theme, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import {useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';

import {useSelector} from 'react-redux';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import CommonLoading from '../../components/CommonLoading';
import {getCustomerWishlist} from '../../redux/wishlist/GetWishlistApiAsyncThunk';
import {all} from 'axios';
import {getProductsByWishlistAsyncThunk} from '../../redux/wishlist/ProductsWishlistApiAsyncThunk';

const ProductDetailsScreen = props => {
  const propData = props.route.params.product;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isUserLoggedIn} = useIsUserLoggedIn();
  const customerCart = useSelector(
    state => state.customerCartIdApiSlice?.customerCart?.data?.data?.[0] || [],
  );

  const [productData, setProductData] = useState();
  const [variationData, setVariationData] = useState();
  const [variationIdData, setVariationIdData] = useState();
  const [prodData, setProdData] = useState(null);
  const [selectedId, setSelectedId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingShopingList, setIsLoadingShopingList] = useState(false);
  const [productAvailability, setProductAvailability] = useState(true);
  const [isProductExistInShoppingList, setIsProductExistInShoppingList] =
    useState(false);
  const shoppingListId = '105fb4c9-0b55-500f-ae5e-bbb48cbf64fc';
  const onPressAddToCart = () => {
    isUserLoggedIn ? addToCartHandler() : navigation.navigate('LoginScreen');
  };
  const onPressAddToShoppingList = () => {
    isUserLoggedIn
      ? addToShoppingListHandler()
      : navigation.navigate('LoginScreen');
  };
  const addToCartHandler = async () => {
    if (variationData && variationData[1]) {
      if (selectedId) {
        var productSkuId = '';
        await variationIdData?.map((item, index) => {
          if (index == selectedId) {
            productSkuId = item;
          }
        });
      } else {
        return alert('select Varint');
      }
    } else {
      productSkuId = variationIdData[0];
    }
    if (productSkuId) {
      const productData = {
        data: {
          type: 'items',
          attributes: {
            sku: productSkuId,
            quantity: 1,
            salesUnit: {
              id: 0,
              amount: 0,
            },
            productOptions: [null],
          },
        },
      };
      // setIsLoading(true);
      CommonLoading.show();
      const response = await api.post(
        `carts/${customerCart.id}/items`,
        productData,
      );
      if (response?.data?.status === 201) {
        dispatch(
          getCustomerCartItems(
            `carts/${customerCart.id}?include=items%2Cbundle-items`,
          ),
        ).then(res => {
          if (res.payload.status === 200) {
            // setIsLoading(false);
            alert('Added to Cart');
          }
          CommonLoading.hide();
        });
        dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
      } else {
        alert('error', response.data.data.errors?.[0]?.detail);
        // setIsLoading(false);
        CommonLoading.hide();
      }
    }
  };

  const addToShoppingListHandler = async () => {
    setIsLoadingShopingList(true);
    if (variationData && variationData[1]) {
      if (selectedId) {
        var productSkuId = '';
        await variationIdData?.map((item, index) => {
          if (index == selectedId) {
            productSkuId = item;
          }
        });
      } else {
        setIsLoadingShopingList(false);
        return alert('select Varint');
      }
    } else {
      productSkuId = variationIdData[0];
    }
    if (productSkuId) {
      const productData = {
        data: {
          type: 'shopping-list-items',
          attributes: {
            productOfferReference: null,
            quantity: 1,
            sku: productSkuId,
          },
        },
      };
      const response = await api.post(
        `shopping-lists/${shoppingListId}/shopping-list-items`,
        productData,
      );
      if (response?.data?.status === 201) {
        setIsLoadingShopingList(false);
        dispatch(getCustomerWishlist('shopping-lists')).then(() => {});
        dispatch(
          getProductsByWishlistAsyncThunk(
            `shopping-lists/${shoppingListId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
          ),
        );
        alert('Added to shopping list');
      } else {
        setIsLoadingShopingList(false);
        alert('error');
      }
    }
  };

  useEffect(() => {
    setProdData(propData);
    const fetchProductData = async () => {
      const response = await commonApi.get(
        `abstract-products/${propData?.abstractSku}?include=abstract-product-availabilities`,
        '',
      );
      if (response.data?.status === 200) {
        setProductAvailability(
          response?.data?.data?.included?.[0]?.attributes?.availability,
        );
        setProductData(response?.data?.data?.data);
        setVariationIdData(
          response?.data?.data?.data?.attributes?.attributeMap
            ?.product_concrete_ids,
        );
      } else {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [propData]);

  useEffect(() => {
    var tempVar = [];
    const handlerfunction = async () => {
      if (productData) {
        Object.keys(
          productData?.attributes?.attributeMap?.attribute_variant_map,
        )?.map((item, index) => {
          tempVar.push({
            id: index,
            sku: productData?.attributes?.attributeMap?.product_concrete_ids[
              index
            ],
            title: Object.keys(
              productData?.attributes?.attributeMap?.attribute_variant_map[
                item
              ],
            ).map(item1 => {
              return productData?.attributes?.attributeMap
                ?.attribute_variant_map[item][item1];
            }),
          });
        });
        setVariationData(tempVar);
        checkIfAddedInShoppingList(
          0,
          productData?.attributes?.attributeMap?.product_concrete_ids[0],
        );
      }
    };
    handlerfunction();
  }, [productData]);
  const productsByWishlist = useSelector(
    state =>
      state?.getProductsByWishlistApiSlice?.productsByWishlist?.data || [],
  );
  useState(() => {
    const matchProductIdWithShoppingListProductsId = () => {
      dispatch(
        getProductsByWishlistAsyncThunk(
          `shopping-lists/${shoppingListId}?include=shopping-list-items%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
        ),
      );
    };
    matchProductIdWithShoppingListProductsId();
  }, [propData]);

  const Row = ({title, value}) => {
    return (
      <Box flexDirection="row">
        <Text style={{fontWeight: 'bold'}}>{title}</Text>
        <Text>{value}</Text>
      </Box>
    );
  };

  if (!productData) {
    return (
      <Box flex={1} backgroundColor="white">
        <ActivityIndicator />
      </Box>
    );
  }

  const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, {backgroundColor}]}>
      <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
    </TouchableOpacity>
  );
  const checkIfAddedInShoppingList = (variantIndex, sku) => {
    const productIds = [];

    productsByWishlist?.included?.forEach(element => {
      if (element.type == 'concrete-products') {
        productIds.push({
          id: element.id,
        });
      }
    });

    const idExists = productIds.some(item => item.id === sku);

    if (idExists) {
      setIsProductExistInShoppingList(true);
    } else {
      setIsProductExistInShoppingList(false);
    }

    setSelectedId(variantIndex);
  };

  const renderItem = ({item, variationData}) => {
    const backgroundColor =
      item.id == selectedId ? theme.colors.lightGrey : '#FFF';
    const color = item.id == selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => checkIfAddedInShoppingList(item.id.toString(), item.sku)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title={productData?.attributes?.name} showCartIcon />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.paddingHorizontal,
          flexGrow: 1,
        }}>
        {prodData && productData ? (
          <Box style={styles.productDetails}>
            <Image
              style={styles.backImage}
              source={{
                uri: prodData?.images[0]?.externalUrlLarge,
              }}
            />
            <Box>
              <Text style={{fontWeight: 'bold'}}>
                {productData?.attributes?.name}
              </Text>
              <Row
                title={'Brand : '}
                value={productData?.attributes?.attributes?.brand}
              />
              {/* <Box>
                  <Text>Product Id: </Text>
                  <Text>Price: </Text>
                  {Object.keys(productData?.attributes?.attributes)?.map(
                    (item, index) => {
                      return <Text key={index}>{item}</Text>;
                    },
                  )}
                </Box>
                <Box>
                  <Text>: {prodData?.abstractSku}</Text>
                  <Text>
                    : $ {prodData?.price} {prodData?.currency}
                  </Text>
                  {Object.keys(productData?.attributes?.attributes)?.map(
                    (item, index) => {
                      return (
                        <Text key={index}>
                          : {productData?.attributes?.attributes[item]}
                        </Text>
                      );
                    },
                  )}
                </Box> */}
              <Box>
                {variationData && variationData[1] && (
                  <Box>
                    <Text style={{fontWeight: 'bold'}}>
                      Choose Variation :{' '}
                    </Text>
                    <FlatList
                      data={variationData}
                      renderItem={({item}) => renderItem({item, variationData})}
                      keyExtractor={item => item.id}
                      extraData={selectedId}
                      contentContainerStyle={styles.productList}
                    />
                  </Box>
                )}
              </Box>
            </Box>
            <Text style={{fontWeight: 'bold'}}>Description : </Text>
            <Text>{productData?.attributes?.description}</Text>
            <Text mt="s6" style={{fontWeight: 'bold'}}>
              Price : $ {prodData?.price}
            </Text>
            {!productAvailability ? (
              <Text color="red">Product is not available </Text>
            ) : (
              <Text color="green">In stock</Text>
            )}
          </Box>
        ) : (
          <ActivityIndicator size="large" color="#0064FD" />
        )}
      </ScrollView>

      <Box paddingVertical="s16" paddingHorizontal="paddingHorizontal">
        <CommonSolidButton
          title={!isLoading ? 'Add to Cart' : 'Loading...'}
          // onPress={addToCartHandler}
          onPress={!isLoading ? onPressAddToCart : () => {}}
          // onPress={onPressAddToCart}
          disabled={!productAvailability}
        />
        <Box mt="s8">
          {!isProductExistInShoppingList ? (
            <TouchableOpacity
              style={styles.wishListContainer}
              onPress={onPressAddToShoppingList}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {isLoadingShopingList ? 'Loading...' : 'Add to Shopping List'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.wishListContainer}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Remove from Shopping List
              </Text>
            </TouchableOpacity>
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  productList: {
    paddingHorizontal: 16,
  },

  backImage: {
    resizeMode: 'contain',
    width: '100%',
    height: 200,
  },
  item: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartButton: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'gray',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  wishListContainer: {
    width: '100%',
    height: 40,
    backgroundColor: theme.colors.red,
    borderRadius: theme.spacing.lml,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    color: 'white',
  },
});

export default ProductDetailsScreen;
