import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';

export default function ApplicationNavigator() {
  const routeNameRef = useRef('');
  const navigationRef = useRef(null);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name || '';
        if (previousRouteName !== currentRouteName) {
          console.log('currentRouteName: ', currentRouteName);
        }
        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}>
      <StackNavigator />
    </NavigationContainer>
  );
}
