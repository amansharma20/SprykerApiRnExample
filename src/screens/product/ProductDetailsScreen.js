import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RadioGroup from 'react-native-radio-buttons-group';
import axios from 'axios';
import {useEffect, useState, useMemo} from 'react';
import {Box, theme} from '@atoms';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const ProductDetailsScreen = props => {
  const navigation = useNavigation();
  const [productData, setProductData] = useState(null);
  const [selectedVarient, setSelectedVarient] = useState(null);
  const prodData = props.route.params.product;
  console.log('product: ', prodData);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `https://glue.de.faas-suite-prod.cloud.spryker.toys/abstract-products/${prodData?.abstractSku}`,
        );
        setProductData(response.data?.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, [prodData]);

  const radioButtons = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Option 1',
        value: 'option1',
      },
      {
        id: '2',
        label: 'Option 2',
        value: 'option2',
      },
    ],
    [],
  );

  const [selectedId, setSelectedId] = useState();

  if (!productData) {
    return <Text>Loading...</Text>;
  }

  console.log('------', selectedVarient, 'productData');

  return (
    <View style={styles.container}>
      {/* <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.registerButton1}
          onPress={() => navigation.goBack()}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/backButton.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}> {productData?.attributes?.name}</Text>
        <TouchableOpacity
          style={[styles.registerButton1, {backgroundColor: 'green'}]}
          onPress={() => navigation.navigate('CartScreen')}>
          <Text style={styles.headerText}>Cart </Text>
        </TouchableOpacity>
      </View> */}
      <Box flexDirection="row">
        <CommonHeader title={productData?.attributes?.name} />
      </Box>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.paddingHorizontal,
        }}>
        {prodData ? (
          <View style={styles.productDetails}>
            <Image
              style={styles.backImage}
              source={{
                uri: prodData?.images[0].externalUrlLarge,
              }}
            />
            <View style={styles.details}>
              <View style={styles.row}>
                <View>
                  <Text>Product Id: </Text>
                  <Text>Price: </Text>
                  {Object.keys(productData?.attributes?.attributes)?.map(
                    (item, index) => {
                      return <Text key={index}>{item}</Text>;
                    },
                  )}
                </View>
                <View>
                  <Text>: {prodData?.abstractSku}</Text>
                  <Text style={styles.highlite}>
                    : $ {prodData?.price} {prodData?.currency}
                  </Text>
                  {Object.keys(productData?.attributes?.attributes)?.map(
                    (item, index) => {
                      return (
                        <Text key={index}>
                          : {productData?.attributes?.attributes[item]}
                        </Text>
                      );
                    },
                  )}
                </View>
              </View>
              <View>
                {/* <Picker
                  selectedValue={selectedVarient}
                  onValueChange={e => setSelectedVarient(e.target.value)}>
                  <Picker.Item label="Option 1" value="option1" />
                  <Picker.Item label="Option 2" value="option2" />
                  <Picker.Item label="Option 3" value="option3" />
                </Picker> */}
                <RadioGroup
                  radioButtons={radioButtons}
                  onPress={setSelectedId}
                  selectedId={selectedId}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.cartButton}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '500',
                }}>
                Add To Cart
              </Text>
            </TouchableOpacity>
            <Text style={styles.description}>Description : </Text>
            <Text style={styles.highlite}>
              {productData?.attributes?.description}
            </Text>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#0064FD" />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: '100%',
    flex: 1,
    // paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
  },
  backImage: {
    marginVertical: 1,
    resizeMode: 'contain',
    width: 470,
    height: 300,
  },
  highlite: {
    color: '#B99C6B',
  },
  details: {
    // widht: 400,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton1: {
    width: '20%',
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  logo: {
    height: 30,
    resizeMode: 'contain',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 28,
    marginRight: 60,
  },
  description: {
    fontWeight: '700',
    fontSize: 16,
    marginVertical: 10,
  },
  dropdownHeading: {
    fontWeight: '700',
    fontSize: 16,
    marginVertical: 20,
  },
  inputField: {
    borderRadius: 16,
    borderColor: '#0064FD',
    padding: 10,
    backgroundColor: '#FAFAFA',
    marginTop: 5,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconInput: {
    marginHorizontal: 12,
  },
  registerButton: {
    width: '100%',
    marginTop: 10,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  cartButton: {
    width: '100%',
    marginVertical: 10,
    marginBottom: '20%',
    backgroundColor: 'gray',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#B8B8B8',
    position: 'absolute',
    bottom: 70,
    paddingTop: 15,
  },
});

export default ProductDetailsScreen;
