// import * as React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import ProductDetailsScreen from '../screens/product/ProductDetailsScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        // keyboardHidesTabBar: true,
      }}>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
      <Stack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
      />
    </Stack.Navigator>
  );
}
