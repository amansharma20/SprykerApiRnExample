import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';

const ProductList = ({title, products}) => {
  return (
    <View>
      <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>
        {title}
      </Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Text style={{marginLeft: 10}}>{item.name}</Text>
        )}
      />
    </View>
  );
};

const SubCategorySection = ({title, products}) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleExpand}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
          {expanded ? '-' : '+'} {title}
        </Text>
      </TouchableOpacity>
      {expanded && <ProductList title={title} products={products} />}
    </View>
  );
};

const CategorySection = ({title, subCategories}) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={{marginBottom: 20}}>
      <TouchableOpacity onPress={toggleExpand}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
          {expanded ? '-' : '+'} {title}
        </Text>
      </TouchableOpacity>
      {expanded &&
        subCategories.map(subCategory => (
          <SubCategorySection
            key={subCategory.id}
            title={subCategory.title}
            products={subCategory.products}
          />
        ))}
    </View>
  );
};

const CategorySectionNew = () => {
  const categories = [
    {
      id: 1,
      title: 'Category 1',
      subCategories: [
        {
          id: 1,
          title: 'Sub-Category 1',
          products: [
            {id: 1, name: 'Product 1'},
            {id: 2, name: 'Product 2'},
            {id: 3, name: 'Product 3'},
          ],
        },
        {
          id: 2,
          title: 'Sub-Category 2',
          products: [
            {id: 4, name: 'Product 4'},
            {id: 5, name: 'Product 5'},
            {id: 6, name: 'Product 6'},
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Category 2',
      subCategories: [
        {
          id: 3,
          title: 'Sub-Category 3',
          products: [
            {id: 7, name: 'Product 7'},
            {id: 8, name: 'Product 8'},
            {id: 9, name: 'Product 9'},
          ],
        },
        {
          id: 4,
          title: 'Sub-Category 4',
          products: [
            {id: 10, name: 'Product 10'},
            {id: 11, name: 'Product 11'},
            {id: 12, name: 'Product 12'},
          ],
        },
      ],
    },
  ];

  return (
    <View style={{padding: 20}}>
      {categories.map(category => (
        <CategorySection
          key={category.id}
          title={category.title}
          subCategories={category.subCategories}
        />
      ))}
    </View>
  );
};

export default CategorySectionNew;
