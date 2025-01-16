import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from './type';
import Icon from 'react-native-vector-icons/FontAwesome';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetails: {
    product: Product;
    updateProduct: (updatedProduct: Product) => void;
    deleteProduct: (productId: number) => void;
  };
  AddProduct: {
    product?: Product;
    handleAddProduct?: (newProduct: Product) => void;
  };
  UpdateProduct: { productId: number };
};

type ProductListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('https://fakestoreapi.com/products');
  const data = await response.json();
  return data;
};

const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch('https://fakestoreapi.com/products/categories');
  const data = await response.json();
  return data;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const hasFetched = useRef(false);
  const navigation = useNavigation<ProductListNavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched.current) {
        const productsData = await fetchProducts();
        setProducts(productsData);
        setAllProducts(productsData);

        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        hasFetched.current = true;
      }
    };

    fetchData();
  }, []);

  const toggleCategorySelection = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(item => item !== category));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    setAllProducts(prev => [...prev, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
    setAllProducts(prev =>
      prev.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
    setAllProducts(prev => prev.filter(product => product.id !== productId));
    Alert.alert('Product deleted successfully');
  };

  const applyFilters = () => {
    if (selectedCategories.length === 0) {
      setProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter(product =>
        selectedCategories.includes(product.category),
      );
      setProducts(filteredProducts);
    }
    setIsFilterModalVisible(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === '') {
      setProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
           placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={({ item }: { item: Product }) => (
          <View style={styles.productCard}>
            <Image
              source={{ uri: item.image }}
              resizeMode="contain"
              style={styles.productImage}
            />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Button
              title="View Details"
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  product: item,
                  updateProduct: handleUpdateProduct,
                  deleteProduct: handleDeleteProduct,
                })
              }
            />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContainer}
      />

      {/* Add Product & Filter Buttons */}
      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('AddProduct', {
              handleAddProduct: handleAddProduct,
            })
          }>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  flatListContainer: {
    paddingBottom: 80, // Space for buttons
  },
  productCard: {
    flex: 1,
    margin: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  footerButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#28A745',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  categoryLabel: {
    fontSize: 16,
  },
});

export default ProductList;
