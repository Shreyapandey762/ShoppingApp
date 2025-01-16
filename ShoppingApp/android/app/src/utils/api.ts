export const fetchAllProducts = async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    return response.json();
  };
  
  export const fetchProductById = async (id: number) => {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    return response.json();
  };
  
  export const fetchProductsWithLimit = async (limit: number) => {
    const response = await fetch(`https://fakestoreapi.com/products?limit=${limit}`);
    return response.json();
  };
  
  export const fetchSortedProducts = async (order: 'asc' | 'desc') => {
    const response = await fetch(`https://fakestoreapi.com/products?sort=${order}`);
    return response.json();
  };
  
  export const fetchCategories = async () => {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    return response.json();
  };
  
  export const fetchProductsByCategory = async (category: string) => {
    const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
    return response.json();
  };
  
  export const addProduct = async (product: any) => {
    const response = await fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return response.json();
  };
  
  export const updateProduct = async (id: number, product: any) => {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    return response.json();
  };
  
  export const fetchProducts = async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    return data; // Array of products
  };
  
  export const deleteProduct = async (productId: number) => {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data; // Deleted product (mock response)
  };  