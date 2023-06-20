import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {commonApi} from '../../api/CommanAPI';
import {api} from '../../api/SecureAPI';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Box, theme} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import {useDispatch} from 'react-redux';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';

const ProductDetailsScreen = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isUserLoggedIn} = useIsUserLoggedIn();
  // const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';
  const cartId = '2d0daf14-f500-5ea7-9425-7f6254ef5ae0';
  const [productData, setProductData] = useState();
  const [variationData, setVariationData] = useState();
  const [variationIdData, setVariationIdData] = useState();
  const [prodData, setProdData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const propData = props.route.params.product;

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
        `carts/${cartId}/items`,
        productData,
        isLoading,
      );
      console.log('response: ', response);
      if (response.data?.status === 201) {
        dispatch(getCustomerCartItems(`carts/${cartId}?include=items`)).then(
          res => {
            console.log('res: ', res);
            if (res.payload.status === 200) {
              setIsLoading(false);
              alert('added to cart');
            }
          },
        );
      } else {
        console.log(
          'response:---------- ',
          response.data.data.errors?.[0]?.detail,
        );
        alert('error', response.data.data.errors?.[0]?.detail);
        setIsLoading(false);
      }
    }
  };

  const onPressAddToCart = () => {
    isUserLoggedIn ? addToCartHandler() : navigation.navigate('LoginScreen');
  };

  if (!productData) {
    return <Text>Loading...</Text>;
  }
  const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, {backgroundColor}]}>
      <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const backgroundColor = item.id == selectedId ? '#825D24' : '#FFF';
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
      <View style={styles.container2}>
        <Box flexDirection="row">
          <CommonHeader title={productData?.attributes?.name} />
        </Box>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.paddingHorizontal,
          }}>
          {prodData && productData ? (
            <View style={styles.productDetails}>
              <Image
                style={styles.backImage}
                source={{
                  uri: prodData?.images[0]?.externalUrlLarge,
                }}
              />
              <View style={styles.details}>
                <View style={styles.row}>
                  <View>
                    <Text>Product Id: </Text>
                    <Text>Price: </Text>
                    {Object.keys(productData?.attributes?.attributes)?.map(
                      (item, index) => {
                        return <Text key={index}>{item}</Text>;
                      },
                    )}
                  </View>
                  <View>
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
                  </View>
                </View>
                <View>
                  <Text>Choose Variation : </Text>
                  {variationData && variationData[1] && (
                    <FlatList
                      data={variationData}
                      renderItem={({item}) => renderItem({item})}
                      keyExtractor={item => item.id}
                      extraData={selectedId}
                    />
                  )}
                </View>
              </View>
              {!isLoading ? (
                <TouchableOpacity
                  style={styles.cartButton}
                  // onPress={e => addToCartHandler(e)}
                  onPress={onPressAddToCart}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '500',
                    }}>
                    Add To Cart
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.cartButton}
                  // onPress={e => addToCartHandler(e)}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '500',
                    }}>
                    Loading ...
                  </Text>
                </TouchableOpacity>
              )}
              <Text style={styles.description}>Description : </Text>
              <Text>{productData?.attributes?.description}</Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#0064FD" />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
  },
  backImage: {
    resizeMode: 'contain',
    width: 270,
    height: 150,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 30,
  },
  title: {
    fontSize: 32,
  },
  row: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
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
