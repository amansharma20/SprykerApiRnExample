/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import {commonApi} from '../../api/CommanAPI';
import {api} from '../../api/SecureAPI';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {getCustomerCartItems} from '../../redux/CartApi/CartApiAsyncThunk';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';
import {useDispatch, useSelector} from 'react-redux';
import {RemoveIcon} from '../../assets/svgs';

const ConfiguredBundledCartItem = ({data, customerCartId}) => {
  const dispatch = useDispatch();

  const [itemImages, setItemImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [templatePrice, setTemplatePrice] = useState(0);

  const changeQuantity = async (templateUUID, data, quantity) => {
    setIsLoading(true);
    // console.log('slotUUID first: ', data[0]?.configuredBundle?.groupKey);
    const groupKey = data[0]?.configuredBundle?.groupKey;
    const items = data.map(item => {
      return {
        sku: item.sku,
        quantity: quantity,
        slotUuid: item.configuredBundleItem.slot.uuid,
      };
    });

    const productCart = {
      data: {
        type: 'configured-bundles',
        attributes: {
          quantity: quantity,
          templateUuid: templateUUID,
          items: items,
        },
      },
    };

    const resp = await api.patch(
      `carts/${customerCartId}/configured-bundles/${groupKey}`,
      JSON.stringify(productCart),
    );
    const response = resp.data;
    // console.log('response: ', response?.data?.data);
    if (response) {
      dispatch(
        getCustomerCartItems(
          `carts/${customerCartId}?include=items%2Cbundle-items`,
        ),
      ).then(error => {
        console.log('error: ', error);
      });
      dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
      setIsLoading(false);
    } else {
    }
  };

  const removeItem = async groupKey => {
    setIsLoading(true);

    const response = await api.Delete(
      `carts/${customerCartId}/configured-bundles/${groupKey}`,
      '',
    );
    dispatch(
      getCustomerCartItems(
        `carts/${customerCartId}?include=items%2Cbundle-items`,
      ),
    ).then(error => {
      console.log('error: ', error);
      setIsLoading(false);
    });
    dispatch(CustomerCartIdApiAsyncThunk('carts')).then(() => {});
    console.log(response);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const updatedItems = await Promise.all(
        data?.data?.map(async item => {
          console.log('item: ', item.sku);
          const response = await commonApi.get(
            `concrete-products/${item.sku}?include=concrete-product-image-sets%2Cconcrete-product-prices`,
            '',
          );
          const productImage =
            response?.data?.data?.included?.[0]?.attributes?.imageSets?.[0]
              ?.images?.[0]?.externalUrlLarge;
          return {
            ...item,
            image: productImage,
            name: response?.data?.data?.data?.attributes?.name,
            price: response?.data?.data?.included?.[1]?.attributes?.price,
          };
        }),
      );
      setItemImages(updatedItems);
    };

    fetchProductData();
  }, [data]);

  return (
    <Box
      borderRadius={8}
      borderColor="border"
      borderWidth={1}
      mb="s8"
      padding="s8"
      backgroundColor="white"
      flex={1}>
      <Box
        flexDirection="row"
        flex={1}
        alignItems="center"
        justifyContent="space-between"
        mb="s8">
        <Text fontSize={16} fontWeight="600">
          {data?.templateName}
        </Text>
        <Box flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={() => removeItem(data?.groupKey)}>
            <Box mr="s10">
              <RemoveIcon />
            </Box>
          </TouchableOpacity>

          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  data?.quantity > 1
                    ? changeQuantity(
                        data?.templateUUID,
                        itemImages,
                        data?.quantity - 1,
                      )
                    : removeItem(data?.groupKey);
                }}>
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{data?.quantity}</Text>
              <TouchableOpacity
                onPress={() => {
                  changeQuantity(
                    data?.templateUUID,
                    itemImages,
                    data?.quantity + 1,
                  );
                }}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </>
          )}
        </Box>
      </Box>

      {itemImages?.map(item => {
        // console.log('item: ', item);
        // setTemplatePrice(templatePrice + item.price * data.quantity);
        return (
          <Box
            borderRadius={8}
            borderColor="border"
            borderWidth={1}
            mb="s8"
            padding="s8"
            flex={1}
            key={item.sku}>
            <Box flexDirection="row" flex={1}>
              <Box alignItems="center" mr="s8" flex={1}>
                <Image
                  style={{height: 120, width: 120, resizeMode: 'contain'}}
                  source={{
                    uri: item.image,
                  }}
                />
              </Box>
              <Box justifyContent="space-between" flex={1}>
                <Box flex={1}>
                  <Box flexShrink={1} flex={1}>
                    <Text fontWeight="700">{item.name}</Text>
                    <Text style={{fontWeight: '600', marginTop: 4}}>
                      $ {item.price} x {data.quantity}
                    </Text>
                  </Box>
                  <Box flex={1} justifyContent="flex-end">
                    <Text style={{fontWeight: 'bold', marginTop: 4}}>
                      $ {item.price * data.quantity}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const styles = StyleSheet.create({
  quantityText: {
    fontSize: 24,
    color: 'black',
  },
  quantity: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});
export default ConfiguredBundledCartItem;
