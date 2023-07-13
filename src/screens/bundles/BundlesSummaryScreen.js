import {StyleSheet} from 'react-native';
import React from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';

const BundlesSummaryScreen = props => {
  const summaryBundleData = props.route?.params?.summaryBundleData;
  const addToCart = props.route?.params?.addToCart;
  console.log('addToCart: ', addToCart);

  const renderItem = (item, index) => {
    return (
      <Box>
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
          key={item.id}>
          <Box alignItems="center">
            <FastImage
              source={{uri: item?.item?.item?.image}}
              style={styles.productImage}
            />
          </Box>
          <Box paddingLeft="s4" justifyContent="space-between">
            <Box flexShrink={1} maxWidth={'80%'}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {item?.item?.item?.name}
              </Text>
              <Text style={styles.productPrice}>
                $ {item?.item?.item?.price}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={'Bundles Summary'} />
      <Box flex={1} paddingHorizontal="paddingHorizontal">
        {/* <FlashList
          data={summaryBundleData}
          renderItem={renderItem}
          estimatedItemSize={4}
        />
        <CommonSolidButton
          title={'Continue'}
          onPress={() => {
            addToCart();
          }}
        /> */}
      </Box>
    </Box>
  );
};

export default BundlesSummaryScreen;

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
