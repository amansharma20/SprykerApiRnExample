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
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Box, theme} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const ProductDetailsScreen = props => {
  const navigation = useNavigation();
  const cartId = 'b2d6946e-bad3-5d6d-ab9f-b8b71f0cc0fc';
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmcm9udGVuZCIsImp0aSI6IjBhNzdkNTUwOTQwMTk5NmZhM2ZmMDA2ZjM3OTBlNjFiYzY4MDFkZTIwODc3MzIzNTNmZDM2OWI5OGUwMTc4NjAzYWRhZWRmZTg3NzY1YzZiIiwiaWF0IjoxNjg2ODIzODkyLjI0NTgyMjksIm5iZiI6MTY4NjgyMzg5Mi4yNDU4MjYsImV4cCI6MTY4Njg1MTY4Niwic3ViIjoie1wiaWRfY29tcGFueV91c2VyXCI6XCJlYmY0YjU1YS1jYWIwLTVlZDAtOGZiNy01MjVhM2VlZWRlYWNcIixcImlkX2FnZW50XCI6bnVsbCxcImN1c3RvbWVyX3JlZmVyZW5jZVwiOlwiREUtLTIxXCIsXCJpZF9jdXN0b21lclwiOjIxLFwicGVybWlzc2lvbnNcIjp7XCJwZXJtaXNzaW9uc1wiOlt7XCJpZF9wZXJtaXNzaW9uXCI6MSxcImNvbmZpZ3VyYXRpb25fc2lnbmF0dXJlXCI6XCJbXVwiLFwiaWRfY29tcGFueV9yb2xlXCI6bnVsbCxcImNvbmZpZ3VyYXRpb25cIjp7XCJpZF9xdW90ZV9jb2xsZWN0aW9uXCI6WzQ5LDUwLDUxLDUyLDUzLDYwNjksNjI3MCw2NTA4LDY1NDQsNjY2NCw2ODMyLDY4MzMsNjgzNSw2ODYzLDc2NDcsNzY0OSw3NjUwLDc2NTEsNzY1Miw3NjUzLDc2NTQsNzY1NSw3NjU2LDc2NTcsNzY1OCw3NjU5LDc2NjAsNzY2MSw3NjYyLDc2NjMsNzY4Myw3Njg0LDc2ODUsNzY4OCw3Njg5LDc2OTAsNzY5MSw3NjkyLDc2OTMsNzcxNiw3NzE3LDc3MTksNzcyMCw3NzIxLDc3MjIsNzcyMyw3NzMwLDc3NDQsNzc0NSw3NzQ2LDc3NDgsNzc0OSw3NzUwLDc3NTQsNzc2MCw3NzczLDc3NzUsNzc3Niw4MDU0LDgwNzcsODA4OSw4MDkwLDgwOTEsODA5Miw4MDkzLDgwOTQsODA5NSw4MDk2LDgwOTcsODExNSw4MTE5LDgxMjIsODE0MCw4MTQxLDgxNDIsODE0Myw4MTQ0LDgxNDUsODE0Niw4MTQ3LDgxNDgsODE0OSw4MTcxLDgxNzksODE4MCw4MTgxLDgxODIsODE4Myw4MTg4LDgxOTIsODIwNiw4MjA3LDgyMDgsODIwOSw4MjEwLDgyMTIsODIxNCw4MjE1LDgyMTYsODIxNyw4MjE5LDgyMjIsODIyMyw4MjI0LDgyMjUsODIyNiw4MjI3LDgyMjgsODIyOSw4MjMwLDgyMzIsODIzMyw4MjM0LDgyMzUsODIzNyw4MjM4LDgyMzksODI0MCw4MjQxLDgyNjEsODI2Miw4NDE4LDg4NTAsODg2NCw5MDE1LDkwMTYsOTAxNyw5MDE4LDkwMTksOTAyNSw5MDI4LDkwMzQsOTAzOCw5MDQzLDkwNDQsOTA0Niw5MDU3LDkwNjQsOTA3MCw5MDg3LDkwODgsOTA4OSw5MDkwLDkxODksOTE5MCw5MTkxLDkyNDcsOTI1MCw5MjYwLDkyNzgsOTI4MSw5MjkyLDkyOTMsOTI5NCw5Mjk1LDkyOTYsOTI5Nyw5Mjk4LDkyOTksOTMwMCw5MzAxLDkzMjEsOTMyMiw5MzIzLDkzMjQsOTMyNSw5MzI2LDkzMjcsOTMyOCw5MzI5LDkzMzAsOTMzMSw5MzMyLDkzMzMsOTMzNCw5MzM1LDkzMzYsOTMzNyw5MzM4LDkzMzksOTM0MCw5MzQxLDkzNDIsOTM0NCw5MzQ1LDkzNDYsOTM0Nyw5MzQ5LDkzNTAsOTM1MSw5MzUyLDkzNTMsOTM1NCw5Mzc1LDkzNzYsOTM3Nyw5NDE2LDk0MTcsOTQzOSw5NDQyLDk0NDMsOTQ2NCw5NDY1LDk0NjYsOTQ2Nyw5NDY4LDk0NjksOTQ3MCw5NDcxLDk0NzIsOTQ3Myw5NDkxLDk1MjIsOTUyMyw5NTI0LDk1NDYsOTU0Nyw5NTQ4LDk1NDksOTU3NCw5NTc4LDk1NzksOTc0MCw5NzQxLDk3NDIsOTc0Myw5NzQ0LDk3NDYsOTc0Nyw5NzQ4LDk4MzUsOTg1Niw5ODU3LDk5OTcsOTk5OCw5OTk5LDEwMDM5LDEwMjQzLDEwMzQ5LDEwMzUyLDEwMzkxLDEwNDExLDEwNDE3LDEwOTU3LDEwOTc3LDExMDQzLDExMzkyLDExNzQ2LDExNzcxLDExNzkyLDEyMzI5LDEyMzMxLDEyMzMyLDEyNTYyLDEyNTYzLDEyNTY0LDEyOTIxLDEyOTIyLDEyOTIzLDEzMjc5LDEzMjgwLDEzMjgxLDEzMjg5LDEzMzAyLDEzNDI0LDEzNDMxLDEzNjQ3LDEzODY4LDEzODcyLDE0MDA3LDE0MDQ2LDE0MDUxLDE0MzkxLDE0NDAzLDE0NDA0LDE0NDM2LDE0NDQ1LDE0NDQ2LDE0NDY1LDE0NTg4LDE1MDYyLDE1MDYzLDE2NTgwLDE2NjA5LDE3NjkzLDE4ODM4LDE5MjUzLDIyNDU1LDIyNTUyLDI1MDc2LDI2MDg5LDI2MDkwLDI2MDkxLDI2MDkyLDI2MDkzLDI2MDk0LDI2MTM1LDI2MTM3LDI2MjM1LDI2MjQzLDI2MjQ1LDI4MjgyLDI4NDkwLDI5MDYzLDI5MTQyLDI5NzM0LDI5NzUwLDMwMDI2LDMwNjQ2LDMxNjgxLDMyNzEwLDMzMjEwLDMzMjExLDMzMzc1LDM0NjI2LDM2MzQzLDM2MzcwLDM4MjY3LDQyMTMwLDQyNTEzLDQzMDQzLDQ3ODEyLDQ3ODM4LDQ3ODM5LDQ3OTg0LDUwNzQ1LDUzMzg4LDU3Mzg3LDY3OTY2LDY4MzM1LDY4NTEyLDY4NzEwLDY4NzExXX0sXCJrZXlcIjpcIlJlYWRTaGFyZWRDYXJ0UGVybWlzc2lvblBsdWdpblwiLFwiaXNfaW5mcmFzdHJ1Y3R1cmFsXCI6bnVsbH0se1wiaWRfcGVybWlzc2lvblwiOjIsXCJjb25maWd1cmF0aW9uX3NpZ25hdHVyZVwiOlwiW11cIixcImlkX2NvbXBhbnlfcm9sZVwiOm51bGwsXCJjb25maWd1cmF0aW9uXCI6e1wiaWRfcXVvdGVfY29sbGVjdGlvblwiOls0OSw1MCw1MSw1Miw1Myw2MDY5LDYyNzAsNjUwOCw2NTQ0LDY2NjQsNjgzMiw2ODMzLDY4MzUsNjg2Myw3NjQ3LDc2NDksNzY1MCw3NjUxLDc2NTIsNzY1Myw3NjU0LDc2NTUsNzY1Niw3NjU3LDc2NTgsNzY1OSw3NjYwLDc2NjEsNzY2Miw3NjYzLDc2ODMsNzY4NCw3Njg1LDc2ODgsNzY4OSw3NjkwLDc2OTEsNzY5Miw3NjkzLDc3MTYsNzcxNyw3NzE5LDc3MjAsNzcyMSw3NzIyLDc3MjMsNzczMCw3NzQ0LDc3NDUsNzc0Niw3NzQ4LDc3NDksNzc1MCw3NzU0LDc3NjAsNzc3Myw3Nzc1LDc3NzYsODA1NCw4MDc3LDgwODksODA5MCw4MDkxLDgwOTIsODA5Myw4MDk0LDgwOTUsODA5Niw4MDk3LDgxMTUsODExOSw4MTIyLDgxNDAsODE0MSw4MTQyLDgxNDMsODE0NCw4MTQ1LDgxNDYsODE0Nyw4MTQ4LDgxNDksODE3MSw4MTc5LDgxODAsODE4MSw4MTgyLDgxODMsODE4OCw4MTkyLDgyMDYsODIwNyw4MjA4LDgyMDksODIxMCw4MjEyLDgyMTQsODIxNSw4MjE2LDgyMTcsODIxOSw4MjIyLDgyMjMsODIyNCw4MjI1LDgyMjYsODIyNyw4MjI4LDgyMjksODIzMCw4MjMyLDgyMzMsODIzNCw4MjM1LDgyMzcsODIzOCw4MjM5LDgyNDAsODI0MSw4MjYxLDgyNjIsODQxOCw4ODUwLDg4NjQsOTAxNSw5MDE2LDkwMTcsOTAxOCw5MDE5LDkwMjUsOTAyOCw5MDM0LDkwMzgsOTA0Myw5MDQ0LDkwNDYsOTA1Nyw5MDY0LDkwNzAsOTA4Nyw5MDg4LDkwODksOTA5MCw5MTg5LDkxOTAsOTE5MSw5MjQ3LDkyNTAsOTI2MCw5Mjc4LDkyODEsOTI5Miw5MjkzLDkyOTQsOTI5NSw5Mjk2LDkyOTcsOTI5OCw5Mjk5LDkzMDAsOTMwMSw5MzIxLDkzMjIsOTMyMyw5MzI0LDkzMjUsOTMyNiw5MzI3LDkzMjgsOTMyOSw5MzMwLDkzMzEsOTMzMiw5MzMzLDkzMzQsOTMzNSw5MzM2LDkzMzcsOTMzOCw5MzM5LDkzNDAsOTM0MSw5MzQyLDkzNDQsOTM0NSw5MzQ2LDkzNDcsOTM0OSw5MzUwLDkzNTEsOTM1Miw5MzUzLDkzNTQsOTM3NSw5Mzc2LDkzNzcsOTQxNiw5NDE3LDk0MzksOTQ0Miw5NDQzLDk0NjQsOTQ2NSw5NDY2LDk0NjcsOTQ2OCw5NDY5LDk0NzAsOTQ3MSw5NDcyLDk0NzMsOTQ5MSw5NTIyLDk1MjMsOTUyNCw5NTQ2LDk1NDcsOTU0OCw5NTQ5LDk1NzQsOTU3OCw5NTc5LDk3NDAsOTc0MSw5NzQyLDk3NDMsOTc0NCw5NzQ2LDk3NDcsOTc0OCw5ODM1LDk4NTYsOTg1Nyw5OTk3LDk5OTgsOTk5OSwxMDAzOSwxMDI0MywxMDM0OSwxMDM1MiwxMDM5MSwxMDQxMSwxMDQxNywxMDk1NywxMDk3NywxMTA0MywxMTM5MiwxMTc0NiwxMTc3MSwxMTc5MiwxMjMyOSwxMjMzMSwxMjMzMiwxMjU2MiwxMjU2MywxMjU2NCwxMjkyMSwxMjkyMiwxMjkyMywxMzI3OSwxMzI4MCwxMzI4MSwxMzI4OSwxMzMwMiwxMzQyNCwxMzQzMSwxMzY0NywxMzg2OCwxMzg3MiwxNDAwNywxNDA0NiwxNDA1MSwxNDM5MSwxNDQwMywxNDQwNCwxNDQzNiwxNDQ0NSwxNDQ0NiwxNDQ2NSwxNDU4OCwxNTA2MiwxNTA2MywxNjU4MCwxNjYwOSwxNzY5MywxODgzOCwxOTI1MywyMjQ1NSwyMjU1MiwyNTA3NiwyNjA4OSwyNjA5MCwyNjA5MSwyNjA5MiwyNjA5MywyNjA5NCwyNjEzNSwyNjEzNywyNjIzNSwyNjI0MywyNjI0NSwyODI4MiwyODQ5MCwyOTA2MywyOTE0MiwyOTczNCwyOTc1MCwzMDAyNiwzMDY0NiwzMTY4MSwzMjcxMCwzMzIxMCwzMzIxMSwzMzM3NSwzNDYyNiwzNjM0MywzNjM3MCwzODI2Nyw0MjEzMCw0MjUxMyw0MzA0Myw0NzgxMiw0NzgzOCw0NzgzOSw0Nzk4NCw1MDc0NSw1MzM4OCw1NzM4Nyw2Nzk2Niw2ODMzNSw2ODUxMiw2ODcxMCw2ODcxMV19LFwia2V5XCI6XCJXcml0ZVNoYXJlZENhcnRQZXJtaXNzaW9uUGx1Z2luXCIsXCJpc19pbmZyYXN0cnVjdHVyYWxcIjpudWxsfSx7XCJpZF9wZXJtaXNzaW9uXCI6bnVsbCxcImNvbmZpZ3VyYXRpb25fc2lnbmF0dXJlXCI6W10sXCJpZF9jb21wYW55X3JvbGVcIjpudWxsLFwiY29uZmlndXJhdGlvblwiOntcImlkX3Nob3BwaW5nX2xpc3RfY29sbGVjdGlvblwiOntcIjBcIjoxLFwiMlwiOjIsXCIzXCI6M319LFwia2V5XCI6XCJSZWFkU2hvcHBpbmdMaXN0UGVybWlzc2lvblBsdWdpblwiLFwiaXNfaW5mcmFzdHJ1Y3R1cmFsXCI6bnVsbH0se1wiaWRfcGVybWlzc2lvblwiOm51bGwsXCJjb25maWd1cmF0aW9uX3NpZ25hdHVyZVwiOltdLFwiaWRfY29tcGFueV9yb2xlXCI6bnVsbCxcImNvbmZpZ3VyYXRpb25cIjp7XCJpZF9zaG9wcGluZ19saXN0X2NvbGxlY3Rpb25cIjp7XCIwXCI6MSxcIjJcIjoyLFwiM1wiOjN9fSxcImtleVwiOlwiV3JpdGVTaG9wcGluZ0xpc3RQZXJtaXNzaW9uUGx1Z2luXCIsXCJpc19pbmZyYXN0cnVjdHVyYWxcIjpudWxsfV19fSIsInNjb3BlcyI6WyJjdXN0b21lciJdfQ.pX_rMF55Dls0BkfhnSBzCZI16A_neyQdkCbXKR1SotHudw1Ng3eamlcoCEDYMWouLmxcZJJMul9hxU_cE6rDXKG-wv5PBp7Sk-ci8Je_op24sO8nXwjZkKh7LErockxLjNLhHZm_TzRrqQe0FKjC5F8tMa2p01EjLX2kfgFdbMz_7P-X6Uy1SPTPISHKpLHk6MPpfjo2w7mG4A1MmC1UcGSF_oZNli_kFk-h6RTTyUME24BKtzjwjEli8lKSTOyD_7YmZoC85-ki7yUDUoQDqTXu-WaPsxH0MTUDdfq4CjVJ4Z7v-q_-dR3djYNKUT6I_Lx9ST4azYF0rGHe9JobvA';
  const [productData, setProductData] = useState();
  const [variationData, setVariationData] = useState();
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

  const AddtoCartHandler = async () => {
    if (selectedId != null) {
      var productSkuId = '';
      await productData?.attributes?.attributeMap?.product_concrete_ids?.map(
        (item, index) => {
          if (index == selectedId) {
            productSkuId = item;
          }
        },
      );
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
      if (response.data?.status === 200) {
        setIsLoading(false);
        alert('added to cart');
      } else {
        console.log('response: ', response);
        setIsLoading(false);
      }
    } else {
      return alert('select Varint');
    }
  };

  if (!productData) {
    return <Text>Loading...</Text>;
  }
  console.log(variationData, '------------------');

  const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, {backgroundColor}]}>
      <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#825D24' : '#FFF';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
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
              <TouchableOpacity
                style={styles.cartButton}
                onPress={e => AddtoCartHandler(e)}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '500',
                  }}>
                  Add To Cart
                </Text>
              </TouchableOpacity>
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
