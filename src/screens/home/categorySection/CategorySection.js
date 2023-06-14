import {useNavigation} from '@react-navigation/native';
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
  ActivityIndicator,
} from 'react-native';
import {commonApi} from '../../../api/CommanAPI';

const CategorySection = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    async function getCategories() {
      try {
        const response = await commonApi.get('category-trees');
        if (response.data.status === 200) {
          setCategoriesData(
            response.data.data.data[0]?.attributes?.categoryNodesStorage,
          );
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log('An error occurred while fetching categories:', error);
        setIsLoading(false);
      }
    }

    getCategories();
  }, []); // Or [] if effect doesn't need props or state

  const renderSubCategory = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('ProductsListScreen', {
            nodeId: item?.nodeId,
          });
        }}
        style={styles.subCategoryItem}>
        <Text style={styles.expandedText}>{item?.name}</Text>
        <Text style={styles.expandedText}>→</Text>
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
        onPress={() => {
          if (item?.children?.length === 0) {
            navigation.navigate('ProductsListScreen', {nodeId: item?.nodeId});
            return;
          }
          handleItemPress(item.nodeId);
        }}
        activeOpacity={0.8}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>
            {item.name}{' '}
            {item?.children?.length !== 0 ? (
              <>
                <Text>({item?.children?.length})</Text>
              </>
            ) : (
              <></>
            )}
          </Text>
          <Text>{expandedItem === item.nodeId ? '-' : '+'}</Text>
        </View>

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
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={
          isLoading ? <ActivityIndicator /> : <Text>EMPTY LIST</Text>
        }
      />
      {/* {!isLoading ? (
        <>
          <FlatList
            data={categoriesData}
            renderItem={renderCategory}
            keyExtractor={item => item.nodeId.toString()}
            contentContainerStyle={styles.flatListContainer}
            ListEmptyComponent={<ActivityIndicator />}
          />
        </>
      ) : (
        <>
          <ActivityIndicator />
        </>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    flexGrow: 1,
  },
  item: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  itemContainer: {justifyContent: 'space-between', flexDirection: 'row'},
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandedView: {
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  expandedText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  subCategoryItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
});

export default CategorySection;
