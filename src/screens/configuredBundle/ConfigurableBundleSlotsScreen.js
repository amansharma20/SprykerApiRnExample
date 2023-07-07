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

  const FlatListChildComponent = props => {
    // console.log('props: ', props);
    return (
      <Box>
        <FlatList
          data={props?.data}
          renderItem={item => {
            console.log('item: ', item);
            const product = item?.item;
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
                    <Image
                      source={{uri: product?.image}}
                      style={styles.productImage}
                    />
                  </TouchableOpacity>
                </Box>
                <Box flex={2} paddingLeft="s4" justifyContent="space-between">
                  <Box>
                    <Text style={styles.productTitle} numberOfLines={2}>
                      {product?.name}
                    </Text>
                    <Text style={styles.productPrice}>$ {product?.price}</Text>
                  </Box>
                </Box>
              </Box>
            );
          }}
        />
      </Box>
    );
  };
  const Slots = item => {
    const slot = item?.item?.item?.id;
    let data = [];

    if (configuredBundleTemplateSlots?.included?.length > 0) {
      const concreteProductData = [];
      const image = [];
      const slotWithProductsID = [];
      const price = [];
      configuredBundleTemplateSlots.included.forEach(element => {
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

          case 'configurable-bundle-template-slots':
            slotWithProductsID.push({
              slotName: element.attributes.name,
              itemId: element.id,
              slotProductsArray:
                element?.relationships['concrete-products']?.data,
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
        slotWithProductsID?.[0]?.slotProductsArray.map(slotWithProductID => {
          //   console.log('slotWithProductID: ', slotWithProductID);
          const matchingImage = image.find(
            img => img.id === slotWithProductID.id,
          );
          const concreteProduct = concreteProductData.find(
            data => data.id === slotWithProductID.id,
          );

          const matchingPrice = price.find(
            prc => prc.id === slotWithProductID.id,
          );

          return {
            id: concreteProduct.id,
            name: concreteProduct.name,
            image: matchingImage?.image,
            price: matchingPrice?.price || 0,
          };
        });
      data = shoppingItems();

      //   console.log('my data', shoppingItems());
    }

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
        {/* <Text> {slotDetails?.name}</Text> */}
        <FlatListChildComponent data={data} slot={slot} />
      </Box>
    );
  };
  useEffect(() => {
    const getConfiguredBundleSlotsByID = async configurableBundleId => {
      setIsLoading(true);
      const response = await commonApi.get(
        `configurable-bundle-templates/${configurableBundleId}?include=configurable-bundle-template-slots%2Cconcrete-products%2Cconcrete-product-image-sets%2Cconcrete-product-prices`,
      );
      //   console.log('response: ', response?.data?.data);
      setConfiguredBundleTemplateSlots(response?.data?.data);
      setIsLoading(false);
    };
    getConfiguredBundleSlotsByID(configurableBundleId);
  }, [configurableBundleId]);
  //   console.log(
  //     'configuredBundleTemplateSlots: ',
  //     JSON.stringify(
  //       configuredBundleTemplateSlots?.data?.relationships[
  //         'configurable-bundle-template-slots'
  //       ].data,
  //     ),
  //   );
  //   console.log('configuredBundleTemplateSlots', configuredBundleTemplateSlots);
  return (
    <Box>
      <CommonHeader title="Back to Bundle" />
      <FlatList
        data={
          configuredBundleTemplateSlots?.data?.relationships[
            'configurable-bundle-template-slots'
          ]?.data
        }
        renderItem={item => {
          return <Slots item={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
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
});
export default ConfigurableBundleSlotsScreen;
