import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CategorySection from './categorySection/CategorySection';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse</Text>
      <CategorySection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;
