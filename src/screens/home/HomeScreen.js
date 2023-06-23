import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Image, ScrollView, FlatList} from 'react-native';
import CategorySection from './categorySection/CategorySection';
import {Box, Text} from '@atoms';
import ContentFullSection from './contentFull/ContentFullSection';
import {useDispatch} from 'react-redux';
import {CustomerCartIdApiAsyncThunk} from '../../redux/customerCartIdApi/CustomerCartIdApiAsyncThunk';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const ViewData = ['ContentFullSection', 'CategorySection'];

  const renderHomeItems = useCallback(({item}) => {
    switch (item) {
      case 'CategorySection':
        return <CategorySection />;

      case 'ContentFullSection':
        return <ContentFullSection />;

      default:
        return <></>;
    }
  }, []);

  return (
    <Box flex={1} backgroundColor="snowy" paddingHorizontal="paddingHorizontal">
      <Text style={styles.title}>Browse</Text>
      <FlatList
        data={ViewData}
        renderItem={renderHomeItems}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;
