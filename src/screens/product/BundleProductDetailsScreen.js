import React from 'react';
import {Box, theme, Text} from '@atoms';

import {StyleSheet, Image} from 'react-native';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
const BundleProductDetailsScreen = props => {
  const bundleProduct = props.route.params.bundleProduct;
  console.log('bundleProducts: ', bundleProduct);
  const bundleProductImage =
    bundleProduct?.[0]?.included?.[0]?.attributes.imageSets?.[0]?.images?.[0]
      ?.externalUrlLarge;
  console.log('bundleProductImage: ', bundleProductImage);

  return (
    // <Box>
    //   <CommonHeader title="Bundle Product" showCartIcon />
    //   <Image
    //     style={styles.backImage}
    //     source={{
    //       uri: bundleProductImage,
    //     }}
    //   />
    //   <Box>
    //     <Text style={{fontWeight: 'bold'}}>
    //       {bundleProduct[0]?.data?.attributes?.name}
    //     </Text>
    //   </Box>
    // </Box>
    <SafeAreaView style={styles.container}>
      <CommonHeader
        title={bundleProduct[0]?.data?.attributes?.name}
        showCartIcon
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.paddingHorizontal,
          flexGrow: 1,
        }}>
        {bundleProduct ? (
          <Box style={styles.productDetails}>
            <Image
              style={styles.backImage}
              source={{
                uri: bundleProductImage,
              }}
            />
            <Box>
              <Text style={{fontWeight: 'bold'}}>
                {bundleProduct[0]?.data?.attributes?.name}
              </Text>
              {/* <Box>
                {variationData && variationData[1] && (
                  <Box>
                    <Text style={{fontWeight: 'bold'}}>
                      Choose Variation :{' '}
                    </Text>
                    <FlatList
                      data={variationData}
                      renderItem={({item}) => renderItem({item})}
                      keyExtractor={item => item.id}
                      extraData={selectedId}
                      contentContainerStyle={styles.productList}
                    />
                  </Box>
                )}
              </Box> */}
            </Box>
            <Text style={{fontWeight: 'bold'}}>Description : </Text>
            <Text>{bundleProduct[0]?.data?.attributes?.description}</Text>
            {/* <Text mt="s6" style={{fontWeight: 'bold'}}>
              Price : $ {prodData?.price}
            </Text> */}
            {/* {!productAvailability ? (
              <Text color="red">Product is not available </Text>
            ) : (
              <Text color="green">In stock</Text>
            )} */}
          </Box>
        ) : (
          <ActivityIndicator size="large" color="#0064FD" />
        )}
      </ScrollView>

      {/* <Box paddingVertical="s16" paddingHorizontal="paddingHorizontal">
        <CommonSolidButton
          title={!isLoading ? 'Add to Cart' : 'Loading...'}
          // onPress={addToCartHandler}
          onPress={!isLoading ? onPressAddToCart : () => {}}
          // onPress={onPressAddToCart}
          disabled={!productAvailability}
        />
      </Box> */}
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
    height: 300,
  },
  item: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  title: {
    fontSize: 32,
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

export default BundleProductDetailsScreen;
