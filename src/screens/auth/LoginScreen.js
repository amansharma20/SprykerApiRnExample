import React, {useContext, useState} from 'react';
import {Box, FONT, Text, theme} from '@atoms';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {commonApi} from '../../api/CommanAPI';
import * as Keychain from 'react-native-keychain';
import {AuthContext} from '../../navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import HomeHeader from '../home/homeHeader/HomeHeader';
import PoweredBySpryker from '../../components/PoweredBySpryker';
import {CrossIcon} from '../../assets/svgs';
import CommonOutlineButton from '../../components/CommonOutlineButton/CommonOutlineButton';
import {useIsUserLoggedIn} from '../../hooks/useIsUserLoggedIn';
import {api} from '../../api/SecureAPI';
import axios from 'axios';
import {createCustomerCart} from '../../redux/createCustomerCart/CreateCustomerCartApiAsyncThunk';
import {useDispatch} from 'react-redux';
export default function LoginScreen(props) {
  const {signIn} = useContext(AuthContext);
  const redirectToScreen = props?.route?.params?.redirectToScreen;
  const hideGuestUserCta = props?.route?.params?.hideGuestUserCta || false;
  const {isUserLoggedIn} = useIsUserLoggedIn();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [userEmail, setUserEmail] = useState('henry.tudor@spryker.com');
  const [password, setPassword] = useState('change123');
  const [isLoading, setIsLoading] = useState(false);

  const onPressLogin = async () => {
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
      console.log('response: ', response?.data?.data);
      setIsLoading(false);
    }
  };

  const onPressGuestUserLogin = async () => {
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
      const getToken = await AsyncStorage.getItem('tokenExpiry');
      if (!getToken) {
        await AsyncStorage.setItem(
          'tokenExpiry',
          // response?.data?.data.expires_in.toString(),
          response?.data?.data.access_token,
        );
      }

      var token = await AsyncStorage.getItem('tokenExpiry');

      token = 'Bearer ' + token;
      var token = 'Bearer ' + response?.data?.data?.access_token;
      let carts = await axios.get(
        'https://glue.de.faas-suite-prod.cloud.spryker.toys/carts',
        {
          headers: {
            Authorization: token,
          },
          validateStatus: () => true,
        },
      );
      var cartId = carts?.data?.data?.[0]?.id;
      const cartLength = carts?.data?.data;
      if (cartLength?.length == 0) {
        const data = {
          type: 'carts',
          attributes: {
            priceMode: 'NET_MODE',
            currency: 'EUR',
            store: 'DE',
            name: 'new',
          },
        };
        let createCustomerCart = await axios.post(
          'https://glue.de.faas-suite-prod.cloud.spryker.toys/carts',
          JSON.stringify(data),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          },
        );
        console.log('Response Data:', createCustomerCart);
      }

      const guestCustomerUniqueId = await AsyncStorage.getItem(
        'guestCustomerUniqueId',
      );
      const url = `https://glue.de.faas-suite-prod.cloud.spryker.toys/guest-carts?include=guest-cart-items`;
      const headers = {
        'Content-Type': 'application/json',
        'X-Anonymous-Customer-Unique-Id': guestCustomerUniqueId,
      };
      await axios
        .get(url, {headers: headers})
        .then(response => {
          const data = response?.data?.included;
          addToCart(data, cartId, token);
        })
        .catch(error => {
          console.error('Error:', error);
        });
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
  // const loginGuestUser = async () => {
  //   onPressGuestUserLogin();
  // };

  const addToCart = async (data, cartId, token) => {
    for (const item of data) {
      const productData = {
        data: {
          type: 'items',
          attributes: {
            sku: item?.attributes?.sku,
            quantity: item?.attributes?.quantity,
            productOfferReference: item?.attributes?.productOfferReference,
            merchantReference: item?.attributes?.merchantReference,
            salesUnit: {
              id: 0,
              amount: 0,
            },
            productOptions: [null],
          },
        },
      };
      var test = JSON.stringify(productData);
      try {
        const response = await axios.post(
          `https://glue.de.faas-suite-prod.cloud.spryker.toys/carts/${cartId}/items`,
          productData,
          {
            headers: {
              Authorization: token,
            },
            validateStatus: () => true,
          },
        );
        // if (response.status === 201) {
        //   signIn(token);
        //   if (redirectToScreen) {
        //     navigation.replace(redirectToScreen);
        //   }
        // }
        console.log('Success:', response.status);
      } catch (error) {
        if (error.response) {
          console.log('Error Response:', error.response.data);
          console.log('Status Code:', error.response.status);
        } else if (error.request) {
          console.log('No Response Received:', error.request);
        } else {
          console.log('Error:', error.message);
        }
      }
    }
  };
  const onPressSubmit = () => {
    if (hideGuestUserCta === true && isUserLoggedIn === false) {
      onPressGuestUserLogin();
    } else {
      onPressLogin();
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
