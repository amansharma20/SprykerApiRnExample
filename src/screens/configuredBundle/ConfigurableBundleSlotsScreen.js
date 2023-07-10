import React, {useEffect, useState} from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {commonApi} from '../../api/CommanAPI';
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ConfigurableBundleSlotsScreen = props => {
  const configurableBundleId = props.route.params?.configurableBundleId;
  const [isLoading, setIsLoading] = useState(false);
  const [configuredBundleTemplateSlots, setConfiguredBundleTemplateSlots] =
    useState([]);

  const Slots = () => {
    const allProductsWithSlots = [];

    if (configuredBundleTemplateSlots?.included?.length > 0) {
      const slotIds =
        configuredBundleTemplateSlots?.data?.relationships[
          'configurable-bundle-template-slots'
        ]?.data;
      slotIds?.forEach(slot => {
        configuredBundleTemplateSlots?.included.forEach(element => {
          if (
            element.type == 'configurable-bundle-template-slots' &&
            slot.id === element.id
          ) {
            allProductsWithSlots.push({
              slotID: slot.id,
              productSKUS: element?.relationships['concrete-products']?.data,
              slotName: element?.attributes?.name,
            });
          }
        });
      });
      console.log('slotIds: ', slotIds.length);

      allProductsWithSlots?.forEach(products => {
        products?.productSKUS?.map((item, index) => {
          configuredBundleTemplateSlots.included.forEach(includedItem => {
            if (
              includedItem.type === 'concrete-product-image-sets' &&
              item?.id === includedItem.id
            ) {
              const externalUrlLarge =
                includedItem.attributes.imageSets[0]?.images[0]
                  ?.externalUrlLarge;
              item.image = externalUrlLarge;
            }
            if (
              includedItem.type === 'concrete-product-prices' &&
              item?.id === includedItem.id
            ) {
              const price = includedItem.attributes.price;
              item.price = price;
            }
            if (
              includedItem.type === 'concrete-products' &&
              item?.id === includedItem.id
            ) {
              const name = includedItem.attributes.name;
              item.name = name;
            }
          });
        });
      });
    }

    return (
      <Box>
        <FlatList
          data={allProductsWithSlots}
          renderItem={slots => {
            const slot = slots?.item;
            return (
              <>
                <Box>
                  <Box flex={2} paddingLeft="s4" justifyContent="space-between">
                    <Box>
                      <Text style={styles.productTitle}>{slot?.slotName}</Text>
                    </Box>
                  </Box>
                  <Box flex={1} alignItems="center">
                    {slot?.productSKUS?.map(product => (
                      <Box
                        flex={1}
                        flexDirection="row"
                        marginHorizontal="s4"
                        flexShrink={1}
                        mb="s8"
                        borderWidth={1}
                        borderColor="border"
                        borderRadius={8}
                        padding="s8"
                        key={product.id}>
                        <Box flex={1} alignItems="center">
                          <TouchableOpacity>
                            <Image
                              source={{uri: product?.image}}
                              style={styles.productImage}
                            />
                          </TouchableOpacity>
                        </Box>
                        <Box
                          flex={2}
                          paddingLeft="s4"
                          justifyContent="space-between">
                          <Box>
                            <Text style={styles.productTitle} numberOfLines={2}>
                              {product?.name}
                            </Text>
                            <Text style={styles.productPrice}>
                              $ {product?.price}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            );
          }}
        />
      </Box>
    );
  };
  useEffect(() => {
    const getConfiguredBundleSlotsByID = async configurableBundleId => {
      setIsLoading(true);
      const response = await commonApi.get(
        `configurable-bundle-templates/${configurableBundleId}?include=configurable-bundle-template-slots%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      );
      setConfiguredBundleTemplateSlots(response?.data?.data);
      setIsLoading(false);
    };
    getConfiguredBundleSlotsByID(configurableBundleId);
  }, [configurableBundleId]);
  return (
    <Box>
      <CommonHeader title="Back to Bundle" />
      {isLoading ? <ActivityIndicator /> : <Slots />}
    </Box>
  );
};
const styles = StyleSheet.create({
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
  },
});
export default ConfigurableBundleSlotsScreen;
