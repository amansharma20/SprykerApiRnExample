import React from 'react';
import {Box, Text, theme} from '@atoms';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import LoginScreen from '../auth/LoginScreen';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {isUserLoggedIn} = useIsUserLoggedIn();
  console.log('isUserLoggedIn: ', isUserLoggedIn);

  const dataArray = [
    {
      name: 'Profile',
      onPress: function () {
        isUserLoggedIn
          ? navigation.navigate('PersonalDetailsScreen')
          : navigation.navigate('LoginScreen', {
              redirectToScreen: 'PersonalDetailsScreen',
            });
      },
    },
    {
      name: 'Your Orders',
      onPress: function () {
        navigation.navigate('YourOrdersScreen');
      },
    },
    {
      name: 'Contact Us',
      onPress: function () {},
    },
    {
      name: 'Feedback',
      onPress: function () {},
    },
    {
      name: 'Language',
      onPress: function () {},
    },
  ];

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer]}
        onPress={() => {
          item.onPress();
        }}>
        <Box flexDirection="row" alignItems="center">
          <Text variant="regular18" style={{paddingLeft: 10}}>
            {item.name}
          </Text>
        </Box>
        <Box>
          <Text>→</Text>
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <Box backgroundColor="background" flex={1}>
      {isUserLoggedIn ? (
        <>
          <Box flex={1}>
            <FlatList
              data={dataArray}
              renderItem={renderItem}
              key={Math.random()}
            />
          </Box>
        </>
      ) : (
        <>
          <LoginScreen />
        </>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.paddingHorizontal,
    justifyContent: 'space-between',
  },
});
