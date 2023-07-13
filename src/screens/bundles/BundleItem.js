/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme, Text, Box} from '@atoms';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import FastImage from 'react-native-fast-image';
import {FlashList} from '@shopify/flash-list';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';

const BundleItem = ({
  BundleData,
  title,
  selectedOptionsIndex,
  postBundleData,
  setPostBundleData,
  summaryBundleData,
  setSummaryBundleData,
  slotID,
  finalState,
}) => {
  const [productsArray, setProductsArray] = useState([]);

  const Item = ({item}) => {
    const onPressItem = () => {
      console.log('item: ', item);
      let newArr = [];
      if ((productsArray || item.index !== -1) && item.isSelected === false) {
        productsArray[item.index].isSelected = !item.isSelected;
        productsArray
          .filter(filterItem => filterItem !== productsArray[item.index])
          .map(newItem => (newItem.isSelected = false));
        newArr.push(...productsArray);
        setProductsArray(newArr);
        if (selectedOptionsIndex !== -1) {
          postBundleData[selectedOptionsIndex] = {
            sku: item.id,
            quantity: 1,
            slotUuid: item.slotID,
          };
          let postArr = postBundleData.filter(
            item => typeof item === 'object' && item !== null,
          );
          setPostBundleData(postArr);

          summaryBundleData[selectedOptionsIndex] = {
            item,
          };
          let summaryArr = summaryBundleData.filter(
            item => typeof item === 'object' && item !== null,
          );
          setSummaryBundleData(summaryArr);
        }
      }
    };

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPressItem}>
        <Box mb="s10" flexDirection="row">
          <BouncyCheckbox
            disableBuiltInState
            isChecked={item.isSelected}
            onPress={onPressItem}
            iconStyle={{
              borderColor: item.isSelected
                ? theme.colors.blue
                : theme.colors.border,
            }}
            fillColor={theme.colors.lightGreen}
          />
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
                source={{uri: item?.image}}
                style={styles.productImage}
              />
            </Box>
            <Box paddingLeft="s4" justifyContent="space-between">
              <Box flexShrink={1} maxWidth={'80%'}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item?.name}
                </Text>
                <Text style={styles.productPrice}>$ {item?.price}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => <Item item={item} />;

  const addQuestions = BundleData?.map((item, index) => {
    return {
      id: item?.id,
      index: index,
      isSelected: false,
      name: item.name,
      price: item.price,
      image: item?.image,
      sku: item?.sku,
      slotID: slotID,
    };
  });

  useEffect(() => {
    setProductsArray(addQuestions);
  }, []);

  return (
    <Box flex={1}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}
        style={styles.body}>
        <Text variant="semiBold18" mb="s10" lineHeight={22}>
          {title}
        </Text>
        {/* <FlatList
        data={productsArray}
        renderItem={renderItem}
        keyExtractor={item => item.index}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 200}}
      /> */}
        <Box flex={1}>
          {/* <FlashList */}
          {productsArray && productsArray.length > 0 ? (
            <>
              <FlashList
                data={productsArray}
                renderItem={renderItem}
                keyExtractor={item => item.index}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                // contentContainerStyle={{paddingBottom: 200}}
                estimatedItemSize={140}
              />
            </>
          ) : (
            <></>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default BundleItem;

const styles = StyleSheet.create({
  body: {
    backgroundColor: theme.colors.background,
    // padding: theme.spacing.s20,
  },
  scrollViewContainer: {
    flexGrow: 1,
    width: SCREEN_WIDTH,
    paddingHorizontal: theme.spacing.paddingHorizontal,
  },
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