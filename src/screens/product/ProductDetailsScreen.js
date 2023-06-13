import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Dummy product data
// const product = {
//   id: 1,
//   title: 'Product 1',
//   price: '$9.99',
//   description:
//     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum ipsum nec aliquam euismod.',
//   image: require('../../assets/images/product1.jpeg'),
// };

const ProductDetailsScreen = props => {
  const navigation = useNavigation();

  const prodData = props.route.params.product;
  console.log('product: ', prodData);
  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Product Details</Text>
    //   <Image source={product.image} style={styles.productImage} />
    //   <Text style={styles.productTitle}>{product.title}</Text>
    //   <Text style={styles.productPrice}>{product.price}</Text>
    //   <Text style={styles.productDescription}>{product.description}</Text>
    //   <TouchableOpacity style={styles.addToCartButton}>
    //     <Text style={styles.addToCartButtonText}>Add to Cart</Text>
    //   </TouchableOpacity>
    // </View>
    <View style={styles.container}>
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.registerButton1}
        onPress={() => navigation.goBack()}
      >
        <Image
          style={styles.logo}
          source={require("../../assets/images/backButton.png")}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}> Product Details </Text>
      <TouchableOpacity
        style={styles.registerButton1}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Text style={styles.headerText}>Cart </Text>
      </TouchableOpacity>
    </View>
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ height: "100%" }}
    >
      {prodData ? (
        <View style={styles.productDetails}>
          <Image
            style={styles.backImage}
            source={{
              uri: prodData?.images[0].externalUrlLarge,
            }}
          />
          <View style={styles.details}>
            <Text style={styles.description}>Description : </Text>
            <Text style={styles.highlite}>{prodData?.abstractName}</Text>
            <Text>Produt Id: </Text>
            <Text>{prodData?.abstractSku}</Text>
            <Text>Price: </Text>
            <Text style={styles.highlite}>
              $ {prodData?.price} {prodData?.currency}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
          >
            <Text
              style={{
                color: "#fff", fontWeight: "500"
              }}
            >
              Add To Cart
            </Text>
          </TouchableOpacity>
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
    height: "100%",
    marginTop: -30,
    paddingHorizontal: 20,
  },
  backImage: {
    marginVertical: 1,
    resizeMode: "contain",
    width: 470,
    height: 300,
  },
  highlite: {
    color: "#B99C6B",
    fontSize: 18,
  },
  details: {
    widht: 400,
  },
  productDetails: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  registerButton1: {
    width: "20%",
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  logo: {
    height: 30,
    resizeMode: "contain",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:-32,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 28,
    marginRight: 60,
  },
  description: {
    fontWeight: "700",
    fontSize: 16,
    marginVertical: 10,
  },
  dropdownHeading: {
    fontWeight: "700",
    fontSize: 16,
    marginVertical: 20,
  },
  inputField: {
    borderRadius: 16,
    borderColor: "#0064FD",
    padding: 10,
    backgroundColor: "#FAFAFA",
    marginTop: 5,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },
  iconInput: {
    marginHorizontal: 12,
  },
  registerButton: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    borderRadius: 16,
    display: "flex",
    flexDirection: "row",
  },
  cartButton: {
    width: "100%",
    marginVertical: 10,
    marginBottom: "20%",
    backgroundColor: "gray",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#B8B8B8",
    position: "absolute",
    bottom: 70,
    paddingTop: 15,
  },
});

export default ProductDetailsScreen;
