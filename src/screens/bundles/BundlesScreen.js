/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {api} from '../../api/SecureAPI';
import axios from 'axios';
import {Button, FlatList, ScrollView, StyleSheet} from 'react-native';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import BundleItem from './BundleItem';

const BundlesScreen = () => {
  const flatListRef = useRef();
  const navigation = useNavigation();

  const [questionnaireData, setQuestionnaireData] = useState([]);
  console.log('questionnaireData: ', questionnaireData);
  const [postQuestionnaireData, setPostQuestionnaireData] = useState([]);
  //   console.log('postQuestionnaireData: ', postQuestionnaireData);

  const [currentIndex, setCurrentIndex] = useState(0);
  console.log('currentIndex: ', currentIndex);
  const [isSelected, setIsSelected] = useState([]);

  const getQuestionnaire = async () => {
    const response = await axios.get(
      'https://console.wealthzi.com/mf/risk-profile-questionaire/v2',
    );
    if (response.status === 200) {
      setQuestionnaireData(response.data.data.questions);
    }
  };

  const renderQuestionnaireItems = ({item, index}) => {
    return (
      <BundleItem
        title={questionnaireData[index]?.title}
        QuestionnaireData={questionnaireData[index]?.options}
        index={index}
        selectedOptionsIndex={index}
        isSelected={isSelected}
        setPostQuestionnaireData={setPostQuestionnaireData}
        postQuestionnaireData={postQuestionnaireData}
      />
    );
  };

  const changeIndexNegative = useCallback(() => {
    setCurrentIndex(index => {
      const newIndex = index - 1;
      flatListRef.current?.scrollToIndex({
        index: newIndex,
      });
      return newIndex;
    });
  }, [currentIndex]);

  const onPressBack = () => {
    if (currentIndex == 0) {
      navigation.goBack();
    } else {
      changeIndexNegative();
    }
  };

  const changeIndexPositive = useCallback(() => {
    // if (postQuestionnaireData[currentIndex]) {
    setIsSelected(true);
    console.log('questionnaireData.length: ', questionnaireData.length);
    setCurrentIndex(index => {
      const newIndex = index < questionnaireData.length - 1 ? index + 1 : index;
      console.log('newIndex: ', newIndex);
      const dummyIndex = index + 1;
      if (dummyIndex !== questionnaireData.length) {
        flatListRef.current?.scrollToIndex({
          index: newIndex,
        });
      } else {
        //   submitQuestions();
        console.log('submit');
      }
      return newIndex;
    });
    // } else {
    //   Toast.show({
    //     type: 'error',
    //     position: 'top',
    //     text1: 'Please select one.',
    //     text2: '',
    //     visibilityTime: 1000,
    //     autoHide: true,
    //     topOffset: IS_IOS ? getStatusBarHeight() : 30,
    //     bottomOffset: 40,
    //   });
    //   console.log('error');
    // }
  }, [currentIndex, questionnaireData]);

  useEffect(() => {
    getQuestionnaire();
  }, []);

  return (
    <Box>
      <FlatList
        data={questionnaireData}
        renderItem={renderQuestionnaireItems}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: 'white',
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        bounces={false}
        ref={ref => (flatListRef.current = ref)}
        onScrollToIndexFailed={() => {
          setTimeout(() => {
            if (flatListRef) {
              flatListRef?.current?.scrollToIndex({
                index: 1,
                animated: true,
              });
            }
          }, 100);
        }}
        // ListEmptyComponent={
        //   <>
        //     <ScrollView
        //       bounces={false}
        //       contentContainerStyle={styles.scrollViewContainer}>
        //       <Box alignItems="center" mb="s40" mt="s20">
        //         <CustomQuestionIcon />
        //         <Text>CustomQuestionIcon</Text>
        //       </Box>
        //       <ShimmerLoaderWrapper isLoading={true} />
        //     </ScrollView>
        //   </>
        // }
      />
      <Button title="changeIndexPositive" onPress={changeIndexPositive} />
      <Button title="changeIndexNegative" onPress={onPressBack} />
    </Box>
  );
};

export default BundlesScreen;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    width: SCREEN_WIDTH,
    paddingHorizontal: theme.spacing.paddingHorizontal,
  },
});
