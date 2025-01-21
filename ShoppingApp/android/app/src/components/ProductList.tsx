import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Product } from './type';

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
};

type ProductListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

const HighlightedText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight) return <Text>{text}</Text>;

  const regex = new RegExp(`(${highlight})`, 'i');
  const parts = text.split(regex);

  return (
    <Text>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Text key={index} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    setCurrentPage(1); 
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  
    if (query === '') {
      setProducts(allProducts);
      setCurrentPage(1); 
      return;
    }
  
    const sortedProducts = [...allProducts].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  
    const binarySearch = (array: Product[], target: string): Product[] => {
      let left = 0;
      let right = array.length - 1;
      const results: Product[] = [];
  
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midTitle = array[mid].title.toLowerCase();
  
        if (midTitle.startsWith(target)) {
          
          let index = mid;
  
          while (index >= 0 && array[index].title.toLowerCase().startsWith(target)) {
            results.push(array[index]);
            index--;
          }
  
          index = mid + 1;
          while (
            index < array.length &&
            array[index].title.toLowerCase().startsWith(target)
          ) {
            results.push(array[index]);
            index++;
          }
  
          break;
        }
  
        if (midTitle < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
  
      return results;
    };
  
    const filteredProducts = binarySearch(
      sortedProducts,
      query.toLowerCase()
    );
  
    setProducts(filteredProducts);
    setCurrentPage(1); 
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

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < products.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
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
  data={paginatedProducts}
  renderItem={({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.image }}
        resizeMode="contain"
        style={styles.productImage}
      />
      <HighlightedText text={item.title} highlight={searchQuery} />
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
  keyExtractor={(item) => item.id.toString()}
  numColumns={2}
  columnWrapperStyle={styles.row}
  contentContainerStyle={styles.flatListContainer}
/>


      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>Filter by Category</Text>
            <ScrollView>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={styles.checkboxContainer}
                  onPress={() => toggleCategorySelection(category)}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedCategories.includes(category) &&
                        styles.checkboxSelected,
                    ]}
                  />
                  <Text style={styles.categoryLabel}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Apply Filters" onPress={applyFilters} />
          </View>
        </View>
      </Modal>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}>
          <Text style={styles.paginationButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>{`Page ${currentPage} of ${Math.ceil(
          products.length / itemsPerPage,
        )}`}</Text>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage * itemsPerPage >= products.length && styles.disabledButton,
          ]}
          onPress={handleNextPage}
          disabled={currentPage * itemsPerPage >= products.length}>
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Buttons */}
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
  flatListContainer: {
    paddingBottom: 80,
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
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  highlight: {
    backgroundColor: 'yellow', 
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
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
  paginationButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 16,
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pageIndicator: {
    fontSize: 16,
    color: '#000',
  },
  checkboxSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  categoryLabel: {
    fontSize: 16,
  },
  footerButtons: {
    position: 'absolute',
    bottom: 80, // Adjusted to be above the pagination controls
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16, // Added spacing to avoid overlap with footer buttons
  },
});

export default ProductList;

