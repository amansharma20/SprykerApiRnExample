/* eslint-disable react-native/no-inline-styles */
import React, {useCallback} from 'react';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import CategorySection from './categorySection/CategorySection';
import {Box, Text, theme} from '@atoms';
import ContentFullSection from './contentFull/ContentFullSection';
import {SearchIconBlack} from '../../assets/svgs';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Icons from '../../assets/constants/Icons';
import HomeHeader from './homeHeader/HomeHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HomeScreen = () => {
  const navigation = useNavigation();
  const ViewData = ['HomeHeader', 'ContentFullSection', 'CategorySection'];
  const insets = useSafeAreaInsets();
  console.log('insets: ', insets);

  const renderHomeItems = useCallback(({item}) => {
    switch (item) {
      case 'HomeHeader':
        return <HomeHeader />;

      case 'ContentFullSection':
        return <ContentFullSection />;

      case 'CategorySection':
        return <CategorySection />;

      default:
        return <></>;
    }
  }, []);

  return (
    <Box flex={1} backgroundColor="white">
      {/* <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="paddingHorizontal"
        backgroundColor="white"
        mb="s4"
        paddingVertical="s4">
        <Text style={styles.title}>Browse</Text>
        <TouchableOpacity
          style={{padding: 4}}
          onPress={() => navigation.navigate('SearchScreen')}>
          <SearchIconBlack />
        </TouchableOpacity>
      </Box> */}
      <FlatList
        data={ViewData}
        renderItem={renderHomeItems}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 16,
  },
});

export default HomeScreen;
