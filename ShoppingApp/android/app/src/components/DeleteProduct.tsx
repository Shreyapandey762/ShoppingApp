import React from 'react';
import { Button, Alert } from 'react-native';
import { deleteProduct } from '../utils/api';

const DeleteProduct = ({ productId }: { productId: number }) => {
  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      Alert.alert('Success', 'Product deleted successfully!', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  return <Button title="Delete Product" onPress={handleDelete} />;
};

export default DeleteProduct;
