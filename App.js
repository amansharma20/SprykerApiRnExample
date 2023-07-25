import React from 'react';
import ApplicationNavigator from './src/navigation/ApplicationNavigator';
import {SafeAreaView} from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ApplicationNavigator />
    </SafeAreaView>
  );
}
