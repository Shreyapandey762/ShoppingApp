import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchCategories } from '../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.categoryItem}>{item}</Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryItem: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Categories;
