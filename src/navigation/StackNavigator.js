// import * as React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, {useEffect, useMemo, useReducer, useRef, useState} from 'react';
import ProductDetailsScreen from '../screens/product/ProductDetailsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ProductsListScreen from '../screens/product/ProductsListScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RNRestart from 'react-native-restart';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PersonalDetailsScreen from '../screens/profile/PersonalDetailsScreen';
import {Alert, AppState} from 'react-native';
import jwt_decode from 'jwt-decode';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import YourOrdersScreen from '../screens/orders/YourOrdersScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import CartScreen from '../screens/cart/CartScreen';

export const AuthContext = React.createContext();

const Stack = createStackNavigator();

export default function StackNavigator() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // if (
      //   appState.current.match(/inactive|background/) &&
      //   nextAppState === 'active'
      // ) {
      // }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    console.log('HERE');
    const getTokenExpiry = async () => {
      const token = await AsyncStorage.getItem('tokenExpiry');
      if (token) {
        var decoded = jwt_decode(token);
        var tokenExpiryDate = new Date(0);
        tokenExpiryDate.setUTCSeconds(decoded.exp);
        var currentDate = new Date();

        var remainingTime = tokenExpiryDate.getTime() - currentDate.getTime();
        if (remainingTime / 1000 <= 0) {
          Alert.alert(
            'Your session has expired.\n',
            'Please login again to continue.',
            [
              {
                text: 'Ok',
                onPress: () => {},
                style: 'destructive',
              },
            ],
          );
          authContext.signOut();
        }
      }
    };
    getTokenExpiry();
  }, [appStateVisible, authContext]);

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        await Keychain.setGenericPassword('email', data);
        dispatch({type: 'SIGN_IN', token: data});
      },
      signOut: async () => {
        await Keychain.resetGenericPassword();
        AsyncStorage.removeItem('tokenExpiry');
        RNRestart.Restart();
        dispatch({type: 'SIGN_OUT'});
      },
      state: state,
    }),
    [state],
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await Keychain.getGenericPassword();
      } catch (e) {}

      userToken === false
        ? dispatch({type: 'RESTORE_TOKEN', token: null})
        : dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          keyboardHidesTabBar: true,
        }}>
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
        {state.userToken == null ? (
          <>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                cardStyleInterpolator:
                  CardStyleInterpolators.forModalPresentationIOS,
                headerShown: false,
                headerShadowVisible: false,
                // cardStyle: {backgroundColor: 'transparent'},
                presentation: 'modal',
              }}
            />
          </>
        ) : (
          <></>
        )}
        <Stack.Screen
          name="ProductDetailsScreen"
          component={ProductDetailsScreen}
        />
        <Stack.Screen
          name="ProductsListScreen"
          component={ProductsListScreen}
        />
        <Stack.Screen
          name="PersonalDetailsScreen"
          component={PersonalDetailsScreen}
        />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="YourOrdersScreen" component={YourOrdersScreen} />
        <Stack.Screen
          name="OrderDetailsScreen"
          component={OrderDetailsScreen}
        />
        <Stack.Screen name="CartScreen" component={CartScreen} />
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
