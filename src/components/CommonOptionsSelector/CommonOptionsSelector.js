/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {Button, FlatList, TouchableOpacity} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const CommonOptionsSelector = ({
  DATA,
  selectedIndex,
  setSelectedIndex,
  onPress,
  handleClosePress,
  hideContinueButton,
}) => {
  const [flatListArray, setFlatListArray] = useState([]);

  const Item = ({item}) => {
    const onPressItem = () => {
      let newArr = [];
      if ((flatListArray || item.index !== -1) && item.isSelected === false) {
        setSelectedIndex(item.index);
        flatListArray[item.index].isSelected = !item.isSelected;
        flatListArray
          .filter(filterItem => filterItem !== flatListArray[item.index])
          .map(newItem => (newItem.isSelected = false));
        newArr.push(...flatListArray);
        setFlatListArray(newArr);
      }
      if (handleClosePress) {
        console.log('handleClosePress: ', handleClosePress);
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
          handleClosePress();
        });
      }
    };

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPressItem}>
        <Box flex={1} flexDirection="row" mb="s12">
          <BouncyCheckbox
            disableBuiltInState
            isChecked={item.isSelected}
            onPress={onPressItem}
            iconStyle={{
              borderColor: theme.colors.green,
            }}
            fillColor={theme.colors.green}
            size={20}
          />
          <Box width={'100%'} flexShrink={1} justifyContent="center">
            <Text
              variant="regular14LightBlack"
              lineHeight={20}
              numberOfLines={1}>
              {item.title}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => <Item item={item} />;

  const addOptions = DATA?.map((item, index) => {
    return {
      title: item.title,
      subTitle: item.subTitle,
      isSelected: index === selectedIndex ? true : false,
      index: index,
    };
  });

  useEffect(() => {
    setFlatListArray(addOptions);
  }, []);

  return (
    <Box>
      <FlatList
        data={flatListArray}
        renderItem={renderItem}
        keyExtractor={item => item.index}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{marginBottom: theme.spacing.s12}}
      />
      {!hideContinueButton && (
        <Box>
          <Button title="CONTINUE" onPress={onPress} />
        </Box>
      )}
    </Box>
  );
};

export default CommonOptionsSelector;
