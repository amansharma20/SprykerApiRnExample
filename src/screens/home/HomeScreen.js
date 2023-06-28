/* eslint-disable react-native/no-inline-styles */
import React, {useCallback} from 'react';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import CategorySection from './categorySection/CategorySection';
import {Box, Text, theme} from '@atoms';
import ContentFullSection from './contentFull/ContentFullSection';
import {SearchIconBlack} from '../../assets/svgs';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const ViewData = ['ContentFullSection', 'CategorySection'];

  const renderHomeItems = useCallback(({item}) => {
    switch (item) {
      case 'ContentFullSection':
        return <ContentFullSection />;

      case 'CategorySection':
        return <CategorySection />;

      default:
        return <></>;
    }
  }, []);

  return (
    <Box flex={1} backgroundColor="snowy">
      <Box
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
      </Box>
      <FlatList
        data={ViewData}
        renderItem={renderHomeItems}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          {
            // paddingHorizontal: theme.spacing.paddingHorizontal,
          }
        }
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
