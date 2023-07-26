/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Text, theme} from '@atoms';
import Icons from '../../assets/constants/Icons';

const SelectShippingMethod = () => {
  const [selectedOption, setSelectedOption] = useState('delivery');
  console.log('selectedOption: ', selectedOption);

  const IS_DELIVERY = selectedOption === 'delivery';
  const IS_PICK_UP = selectedOption === 'pickup';

  const handleOptionChange = option => {
    setSelectedOption(option);
  };

  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      paddingVertical="s16"
      paddingHorizontal="s28">
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="snowy"
        borderRadius={100}>
        <TouchableOpacity
          onPress={() => handleOptionChange('delivery')}
          style={[styles.tabButton, IS_DELIVERY && styles.selectedTabButton]}>
          <Box flexDirection="row" alignItems="center">
            <Image
              source={Icons.deliveryIcon}
              style={[
                styles.icon,
                IS_DELIVERY && {tintColor: theme.colors.sushiittoRed},
              ]}
              resizeMode="contain"
            />
            <Text
              style={[styles.tabText, IS_DELIVERY && styles.selectedTabText]}>
              Delivery
            </Text>
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOptionChange('pickup')}
          style={[styles.tabButton, IS_PICK_UP && styles.selectedTabButton]}>
          <Box flexDirection="row" alignItems="center">
            <Image
              source={Icons.pickUpIcon}
              style={[
                styles.icon,
                IS_PICK_UP && {tintColor: theme.colors.sushiittoRed},
              ]}
              resizeMode="contain"
            />
            <Text
              style={[styles.tabText, IS_PICK_UP && styles.selectedTabText]}>
              Pick Up
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  selectedTabButton: {
    backgroundColor: theme.colors.veryLightRed,
    borderRadius: 100,
    borderColor: theme.colors.sushiittoRed,
    borderWidth: 1,
  },
  tabText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.sushiittoRed,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.black,
    marginRight: 4,
  },
});

export default SelectShippingMethod;
