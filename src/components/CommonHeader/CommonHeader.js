import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, theme} from '@atoms';
import GoBackButton from '../GoBackButton/GoBackButton';
// import GoBackButton from './GoBackButton/GoBackButton';

const CommonHeader = ({title, onPress, ...props}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container} {...props}>
      <GoBackButton onPress={onPress} />
      <Text variant="bold18" style={{width: '90%'}} numberOfLines={1}>
        {title}
      </Text>
    </SafeAreaView>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.paddingHorizontal,
    marginBottom: theme.spacing.s8,
  },
});
