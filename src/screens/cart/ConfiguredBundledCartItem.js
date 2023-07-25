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
  //   console.log('customerCartId: ', customerCartId);
  //   console.log('data: ', data);
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
    console.log('response: ', response?.data?.data);
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
      backgroundColor="white">
      <Box flexDirection="row" justifyContent="space-between">
        <Box>
          <Text>{data?.templateName}</Text>
        </Box>

        <Box flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={() => removeItem(data?.groupKey)}>
            <Text style={{marginRight: 10}}>
              <RemoveIcon />
            </Text>
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

      {itemImages.map(item => {
        // console.log('item: ', item);
        // setTemplatePrice(templatePrice + item.price * data.quantity);
        return (
          <Box
            borderRadius={8}
            borderColor="border"
            borderWidth={1}
            mb="s8"
            padding="s8"
            backgroundColor="white"
            key={item.sku}>
            <Box flexDirection="row">
              <Box alignItems="center" mr="s8">
                <Image
                  style={{height: 120, width: 120, resizeMode: 'contain'}}
                  source={{
                    uri: item.image,
                  }}
                />
              </Box>
              <Box justifyContent="space-between">
                <Box>
                  <Box flexDirection="row">
                    <Text>{item.name}</Text>
                  </Box>
                  <Text style={{fontWeight: 'bold', marginTop: 4}}>
                    $ {item.price} x {data.quantity}{' '}
                    {'                          '} {item.price * data.quantity}
                  </Text>
                  {/* <Text>x {data.quantity} </Text> */}
                </Box>
                <Box mb="s8">
                  {/* <TouchableOpacity onPress={() => removeItem(cartItem.itemId)}>
                    <Text>
                      <RemoveIcon />
                    </Text>
                  </TouchableOpacity> */}
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
