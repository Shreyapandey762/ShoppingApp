import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateProduct } from '../utils/api';

const UpdateProduct = ({ route }: { route: any }) => {
  const { productId } = route.params;
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = () => {
    const updatedProduct = {
      title,
      price: parseFloat(price),
      description,
      category,
    };

    updateProduct(productId, updatedProduct)
      .then(() => Alert.alert('Product updated successfully'))
      .catch(() => Alert.alert('Failed to update product'));
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Title" style={styles.input} onChangeText={setTitle} />
      <TextInput placeholder="Price" style={styles.input} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput placeholder="Description" style={styles.input} onChangeText={setDescription} />
      <TextInput placeholder="Category" style={styles.input} onChangeText={setCategory} />
      <Button title="Update Product" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderBottomWidth: 1, marginBottom: 12, fontSize: 16 },
});

export default UpdateProduct;
