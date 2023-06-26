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
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProdData(propData);
    const fetchProductData = async () => {
      const response = await commonApi.get(
        `abstract-products/${propData?.abstractSku}`,
        '',
      );
      if (response.data?.status === 200) {
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
      }
    };
    handlerfunction();
  }, [productData]);

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
      setIsLoading(true);
      const response = await api.post(
        `carts/${customerCart.id}/items`,
        productData,
        isLoading,
      );
      if (response?.data?.status === 201) {
        dispatch(
          getCustomerCartItems(`carts/${customerCart.id}?include=items`),
        ).then(res => {
          if (res.payload.status === 200) {
            setIsLoading(false);
            alert('Added to Cart');
          }
        });
        dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
      } else {
        alert('error', response.data.data.errors?.[0]?.detail);
        setIsLoading(false);
      }
    }
  };

  const onPressAddToCart = () => {
    isUserLoggedIn ? addToCartHandler() : navigation.navigate('LoginScreen');
  };

  const Row = ({title, value}) => {
    return (
      <Box flexDirection="row">
        <Text>{title}</Text>
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

  const renderItem = ({item}) => {
    const backgroundColor =
      item.id == selectedId ? theme.colors.lightGrey : '#FFF';
    const color = item.id == selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id.toString())}
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
              <Text>{productData?.attributes?.name}</Text>
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
                    <Text>Choose Variation : </Text>
                    <FlatList
                      data={variationData}
                      renderItem={({item}) => renderItem({item})}
                      keyExtractor={item => item.id}
                      extraData={selectedId}
                    />
                  </Box>
                )}
              </Box>
            </Box>
            <Text>Description : </Text>
            <Text>{productData?.attributes?.description}</Text>
          </Box>
        ) : (
          <ActivityIndicator size="large" color="#0064FD" />
        )}
      </ScrollView>
      <Box paddingVertical="s16" paddingHorizontal="paddingHorizontal">
        <CommonSolidButton
          title={!isLoading ? 'Add to Cart' : 'Loading...'}
          // onPress={addToCartHandler}
          onPress={!isLoading ? addToCartHandler : () => {}}
        />
        {/* <Box mt="s16">
                <CommonSolidButton
                  title={!isLoading ? 'Buy Now' : 'Loading...'}
                  // onPress={addToCartHandler}
                  onPress={() => onPressAddToCart(true)}
                />
              </Box> */}
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
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
});

export default ProductDetailsScreen;
