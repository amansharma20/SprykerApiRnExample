import React from 'react';
import {Box, Text} from '@atoms';
const ConfiguredBundledCartItem = ({data}) => {
  //   console.log('datas: ', data?.data?.length);
  const items = data?.data;
  return (
    <Box
      borderRadius={8}
      borderColor="border"
      borderWidth={1}
      mb="s8"
      padding="s8"
      backgroundColor="white">
      <Text>{data?.templateName}</Text>
      {items?.map(item => {
        console.log('item: ', item.sku);
        return (
          <Box>
            <Box flexDirection="row">
              <Box alignItems="center" mr="s8">
                <Text>SKU : {item.sku} </Text>
                <Text>Quantity : {item.quantity} </Text>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
export default ConfiguredBundledCartItem;
