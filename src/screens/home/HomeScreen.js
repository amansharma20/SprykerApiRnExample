import React from 'react';
import {View, StyleSheet} from 'react-native';
import CategorySection from './categorySection/CategorySection';
import {Box, Text} from '@atoms';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse</Text>
      <Box>
        <Text>text</Text>
      </Box>
      <CategorySection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;
