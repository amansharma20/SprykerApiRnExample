import React, {useContext, useState} from 'react';
import {Box, FONT, Text, theme} from '@atoms';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {commonApi} from '../../api/CommanAPI';
import {AuthContext} from '../../navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import HomeHeader from '../home/homeHeader/HomeHeader';
import PoweredBySpryker from '../../components/PoweredBySpryker';
import {CrossIcon} from '../../assets/svgs';
import CommonOutlineButton from '../../components/CommonOutlineButton/CommonOutlineButton';

export default function LoginScreen(props) {
  const {signIn} = useContext(AuthContext);
  const redirectToScreen = props?.route?.params?.redirectToScreen;
  const hideGuestUserCta = props?.route?.params?.hideGuestUserCta || false;

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
      // client_id: 'frontend',
      // client_secret: 'qq7NRNQDJbQ8dFq91Swm3pjFmVPmQd6CMfOPtBlp5hIWytMs',
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
      <Box alignItems="flex-end">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Box padding="s4">
            <CrossIcon />
          </Box>
        </TouchableOpacity>
      </Box>
      <Box paddingVertical="s16" pb="s32">
        <HomeHeader />
      </Box>
      {/* <Text variant="bold24" mb="s16">
        Login to continue
      </Text> */}
      <Text variant="regular14" color="lightBlack" mr="s4" mb="s12">
        Enter your email to get started
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
            {/* <Button title="SUBMIT" onPress={onPressSubmit} /> */}
            <CommonSolidButton title="LOGIN" onPress={onPressSubmit} />

            {hideGuestUserCta === true ? (
              <></>
            ) : (
              <>
                <Box paddingVertical="s16" alignItems="center">
                  <Text>OR</Text>
                </Box>
                <CommonOutlineButton
                  title={'Continue as a Guest User'}
                  onPress={() => navigation.navigate('Home')}
                />
              </>
            )}
          </>
        ) : (
          <>
            <ActivityIndicator color={theme.colors.sushiittoRed} />
          </>
        )}
      </Box>
      <Box justifyContent="flex-end" flex={1} pb="s16">
        <PoweredBySpryker />
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
    fontFamily: FONT.Primary,
  },
});
