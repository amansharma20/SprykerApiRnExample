import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  LayoutAnimation,
} from 'react-native';

const CategorySection = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;

  const handleItemPress = nodeId => {
    setExpandedItem(expandedItem === nodeId ? null : nodeId);
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    });
  };

  useEffect(() => {
    async function getCategories() {
      // You can await here
      const response = await axios.get(
        'https://glue.de.faas-suite-prod.cloud.spryker.toys/category-trees',
      );
      if (response.status === 200) {
        setCategoriesData(
          response.data.data[0]?.attributes?.categoryNodesStorage,
        );
      }
      // ...
    }
    getCategories();
  }, []); // Or [] if effect doesn't need props or state

  const renderSubCategory = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => console.log('id: ', item?.nodeId)}>
        <Text style={styles.expandedText}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({item}) => {
    const expandStyle = {
      maxHeight: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
      }),
      opacity: animation,
    };

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleItemPress(item.nodeId)}
        activeOpacity={0.8}>
        <Text style={styles.itemText}>{item.name}</Text>
        {expandedItem === item.nodeId && (
          <>
            <Animated.View style={[styles.expandedView, {expandStyle}]}>
              <FlatList
                data={item?.children}
                renderItem={renderSubCategory}
                keyExtractor={item => item.nodeId.toString()}
              />
            </Animated.View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categoriesData}
        renderItem={renderCategory}
        keyExtractor={item => item.nodeId.toString()}
        contentContainerStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flex: 1,
  },
  item: {
    margin: 8,
    padding: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expandedView: {
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  expandedText: {
    fontSize: 14,
    color: '#333333',
  },
});

export default CategorySection;
