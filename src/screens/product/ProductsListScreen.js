import {View, Text} from 'react-native';
import React from 'react';

export default function ProductsListScreen(props) {
  const {nodeId} = props.route.params;

  return (
    <View>
      <Text>ProductsListScreen</Text>
      <Text>{nodeId}</Text>
    </View>
  );
}
