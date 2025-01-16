import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ProductList from './android/app/src/components/ProductList';
import ProductDetails from './android/app/src/components/ProductDetails';
import AddProduct from './android/app/src/components/AddProducts';
import UpdateProduct from './android/app/src/components/UpdateProduct';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductList">
        <Stack.Screen name="ProductList" component={ProductList} options={{ title: 'Product List' }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product Details' }} />
        <Stack.Screen name="AddProduct" component={AddProduct} options={{ title: 'Add Product' }} />
        <Stack.Screen name="UpdateProduct" component={UpdateProduct} options={{ title: 'Update Product' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
