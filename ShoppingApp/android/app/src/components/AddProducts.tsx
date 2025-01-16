import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker'; // Import image picker
import {addProduct} from '../utils/api';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './ProductList';
import { Product } from './type';

type ProductListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

const AddProduct = ({route}: {route: any}) => {
  const navigation = useNavigation<ProductListNavigationProp>();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState<number|null>(null)
  
  const {handleAddProduct} = route.params;

  useEffect(() => {
    if (route.params?.product) {
      const {product} = route.params;
      setTitle(product.title);
      setPrice(product.price.toString());
      setDescription(product.description);
      setCategory(product.category);
      setImageUri(product.image);
      setIsUpdate(true);
      setId(product.id);
    }
  }, [route.params]);

  const handleImageUpload = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri!);
      }
    });
  };

  const handleSubmit = async () => {
    if (!title || !price || !description || !category || !imageUri) {
      Alert.alert('Please fill all fields and upload an image');
      return;
    }

    const product = {
      title,
      price: parseFloat(price),
      description,
      category,
      image: imageUri,
      id : id
    };

    if (isUpdate) {
      Alert.alert('Product updated successfully');
      if(handleAddProduct)
        handleAddProduct(product);
      navigation.pop(2);
    } else {
      try {
        const data : Product = await addProduct(product);
        if (handleAddProduct) {
          handleAddProduct({...product,id:data});
        }
        Alert.alert('Product added successfully');
        navigation.goBack();
      } catch (e) {
        Alert.alert('Failed to add product');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isUpdate ? 'Update Product' : 'Add Product'}
      </Text>
      <TextInput
        placeholder="Title"
        style={styles.input}
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Price"
        style={styles.input}
        placeholderTextColor="#888"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Description"
        style={styles.input}
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Category"
        style={styles.input}
        placeholderTextColor="#888"
        value={category}
        onChangeText={setCategory}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.uploadButtonText}>
          {imageUri ? 'Change Image' : 'Upload Image'}
        </Text>
      </TouchableOpacity>
      {imageUri && (
        <Image
          source={{uri: imageUri}}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      )}
      <Button
        title={isUpdate ? 'Update Product' : 'Add Product'}
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    fontSize: 16,
    color: 'black',
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
});

export default AddProduct;
