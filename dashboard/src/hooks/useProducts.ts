/**
 * useProducts - Custom hook for product management UI logic
 * Following .cursorrules: UI logic separation, <100 lines, reusable
 */

import { useState, useEffect, useCallback } from 'react';
import { ProductManager, Product, ProductFormData } from '../services/ProductManager';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const productManager = new ProductManager();

  /**
   * Load all products
   */
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allProducts = productManager.getAllProducts();
      setProducts(allProducts);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new product
   */
  const createProduct = useCallback(async (formData: ProductFormData) => {
    try {
      setError(null);
      const newProduct = productManager.createProduct(formData);
      setProducts(prev => [...prev, newProduct]);
      return { success: true, product: newProduct };
    } catch (err) {
      const errorMessage = 'Failed to create product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Update existing product
   */
  const updateProduct = useCallback(async (id: string, formData: ProductFormData) => {
    try {
      setError(null);
      const updatedProduct = productManager.updateProduct(id, formData);
      if (!updatedProduct) {
        throw new Error('Product not found');
      }
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return { success: true, product: updatedProduct };
    } catch (err) {
      const errorMessage = 'Failed to update product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Delete product
   */
  const deleteProduct = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = productManager.deleteProduct(id);
      if (!success) {
        throw new Error('Product not found');
      }
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = 'Failed to delete product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Get products by type
   */
  const getProductsByType = useCallback((type: Product['type']) => {
    return products.filter(product => product.type === type);
  }, [products]);

  /**
   * Get active products only
   */
  const getActiveProducts = useCallback(() => {
    return products.filter(product => product.isActive);
  }, [products]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByType,
    getActiveProducts,
    refreshProducts: loadProducts
  };
};
