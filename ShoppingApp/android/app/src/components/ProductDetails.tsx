import React, {useEffect, useState} from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {fetchProductById, deleteProduct} from '../utils/api';
import {Product} from './type';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './ProductList';

type ProductListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

const ProductDetails = ({route}: {route: any}) => {
  const {product, updateProduct, deleteProduct} = route.params;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ProductListNavigationProp>();

  if (!product) {
    return <Text style={styles.notFound}>Product not found</Text>;
  }

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  const handleProductDelete = async () => {
    try {
      // await deleteProduct(product.id);
      if (deleteProduct) {
        deleteProduct(product.id);
      }
      Alert.alert('Product deleted successfully');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Failed to delete product');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product ? (
        <>
          <Image source={{uri: product.image}} style={styles.image} />
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.category}>Category: {product.category}</Text>
          <Button
            title="Delete Product"
            color="#d9534f"
            onPress={handleProductDelete}
          />
          <Button
            title="Update Product"
            color="#007BFF"
            onPress={() => {
              navigation.navigate('AddProduct', {product , handleAddProduct: updateProduct}); // Pass product data
            }}
          />
        </>
      ) : (
        <Text style={styles.notFound}>Product not found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  price: {
    fontSize: 20,
    color: '#28a745',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    lineHeight: 22,
  },
  category: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  notFound: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
});

export default ProductDetails;
