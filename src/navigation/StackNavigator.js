// import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ProductDetailsScreen from '../screens/product/ProductDetailsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ProductsListScreen from '../screens/product/ProductsListScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        keyboardHidesTabBar: true,
      }}>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
      <Stack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
      />
      <Stack.Screen name="ProductsListScreen" component={ProductsListScreen} />
    </Stack.Navigator>
  );
}
