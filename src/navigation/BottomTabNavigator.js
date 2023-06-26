/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CartScreen from '../screens/cart/CartScreen';
import {HomeIcon} from '../assets/svgs';
import {Image} from 'react-native';
import Icons from '../assets/constants/Icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const Icon = ({source, focused, color}) => {
    return (
      <Image
        source={source}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? '#4486c6' : color,
        }}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{headerShown: false, tabBarActiveTintColor: '#4486c6'}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon source={Icons.homeIcon} focused={focused} color={color} />
            );
          },
        }}
      />
      {/* <Tab.Screen name="Search" component={SearchScreen} /> */}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Icon source={Icons.cartIcon} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Icon source={Icons.profileIcon} focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
