import React from 'react';
import {Box, Text} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const BundledProductsListScreen = props => {
  const title = props.route.params?.title;
  console.log('title: ', title);
  return (
    <Box flex={1} backgroundColor="white">
      <CommonHeader title={title} />
      <Box flex={1} paddingHorizontal="paddingHorizontal">
        <Text>BundledProductsListScreen</Text>
      </Box>
    </Box>
  );
};

export default BundledProductsListScreen;
