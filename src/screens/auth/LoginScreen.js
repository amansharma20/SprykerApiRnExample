import React, {useContext, useState} from 'react';
import {Box, Text, theme} from '@atoms';
import {ActivityIndicator, Button, StyleSheet, TextInput} from 'react-native';
import {commonApi} from '../../api/CommanAPI';
import {AuthContext} from '../../navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

export default function LoginScreen(props) {
  const {signIn} = useContext(AuthContext);
  const {redirectToScreen} = props.route.params;

  const navigation = useNavigation();

  const [userEmail, setUserEmail] = useState('sonia@spryker.com');
  const [password, setPassword] = useState('change123');
  const [isLoading, setIsLoading] = useState(false);

  const onPressSubmit = async () => {
    setIsLoading(true);
    const apiData = {
      grant_type: 'password',
      username: userEmail,
      password: password,
    };
    const response = await commonApi.post('token', apiData, {
      'Content-Type': 'multipart/form-data',
    });
    if (response.data?.status === 200) {
      await AsyncStorage.setItem(
        'tokenExpiry',
        // response?.data?.data.expires_in.toString(),
        response?.data?.data.access_token,
      );
      var token = 'Bearer ' + response?.data?.data?.access_token;
      // var token = 'Bearer ' + response?.data?.data?.refresh_token;
      signIn(token);
      if (redirectToScreen) {
        navigation.replace(redirectToScreen);
      }
      setIsLoading(false);
    } else {
      console.log('response: ', response);
      setIsLoading(false);
    }
  };

  return (
    <Box flex={1} padding="s16" backgroundColor="white">
      <Text variant="bold24" mb="s16">
        Login to continue
      </Text>
      <Text variant="regular14" color="lightBlack" mr="s4" mb="s12">
        Email Address
      </Text>
      <TextInput
        style={styles.input}
        placeholder="john.doe@example.com"
        value={userEmail}
        onChangeText={text => {
          setUserEmail(text);
        }}
        autoCapitalize={false}
        keyboardType="email-address"
        placeholderTextColor={theme.colors.lightGrey}
      />
      <Text variant="regular14" color="lightBlack" mr="s4" marginVertical="s12">
        Password
      </Text>
      <TextInput
        style={styles.input}
        placeholder="password"
        value={password}
        onChangeText={text => {
          setPassword(text);
        }}
        autoCapitalize={false}
        placeholderTextColor={theme.colors.lightGrey}
      />
      <Box mt="s16">
        {!isLoading ? (
          <>
            <Button title="SUBMIT" onPress={onPressSubmit} />
          </>
        ) : (
          <>
            <ActivityIndicator />
          </>
        )}
        {/* <Button title="SignOut" onPress={() => signOut()} /> */}
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.inputGrey,
    height: 54,
    width: '100%',
    borderRadius: 8,
    paddingLeft: 16,
    fontSize: 16,
  },
});
