/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import {FlatList, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme, Text, Box} from '@atoms';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';

const BundleItem = ({
  QuestionnaireData,
  title,
  selectedOptionsIndex,
  postQuestionnaireData,
  setPostQuestionnaireData,
}) => {
  const [questionsArray, setQuestionsArray] = useState([]);

  const Item = ({item}) => {
    const onPressItem = () => {
      let newArr = [];
      if ((questionsArray || item.index !== -1) && item.isSelected === false) {
        questionsArray[item.index].isSelected = !item.isSelected;
        questionsArray
          .filter(filterItem => filterItem !== questionsArray[item.index])
          .map(newItem => (newItem.isSelected = false));
        newArr.push(...questionsArray);
        setQuestionsArray(newArr);
        if (selectedOptionsIndex !== -1) {
          postQuestionnaireData[selectedOptionsIndex] = {
            response: {option: item.option, title: item.title},
            title: title,
          };
          setPostQuestionnaireData(postQuestionnaireData);
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
                ? theme.colors.green
                : theme.colors.border,
            }}
            fillColor={theme.colors.green}
          />
          <Box
            borderColor={item.isSelected ? 'green' : 'border'}
            borderWidth={1}
            flex={1}
            justifyContent="center"
            minHeight={40}
            pl={'s18'}
            borderRadius={8}
            backgroundColor={item.isSelected ? 'lightGreen' : 'background'}
            paddingVertical={'s8'}>
            <Text
              variant="semiBold14"
              color={item.isSelected ? 'green' : 'lightBlack'}>
              {item.title}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => <Item item={item} />;

  const addQuestions = QuestionnaireData?.map((item, index) => {
    return {
      title: item.title,
      option: item.option,
      isSelected: false,
      index: index,
    };
  });

  useEffect(() => {
    setQuestionsArray(addQuestions);
  }, []);

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={styles.scrollViewContainer}
      style={styles.body}>
      <Box alignItems="center" mb="s40" mt="s20">
        <Text>icon</Text>
      </Box>
      <Text variant="semiBold18" mb="s10" lineHeight={22}>
        {title}
      </Text>
      <FlatList
        data={questionsArray}
        renderItem={renderItem}
        keyExtractor={item => item.index}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
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
});
