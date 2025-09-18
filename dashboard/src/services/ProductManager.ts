/**
 * ProductManager - Business logic for product management
 * Following .cursorrules: Single responsibility, <200 lines, reusable
 */

export interface Product {
  id: string;
  name: string;
  type: 'product' | 'app' | 'package';
  price: number;
  commissionRate: number; // percentage (e.g., 15 = 15%)
  category: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  type: 'product' | 'app' | 'package';
  price: number;
  commissionRate: number;
  category: string;
  description: string;
  isActive: boolean;
}

export class ProductManager {
  private readonly STORAGE_KEY = 'maxpulse-products';
  private readonly DEFAULT_COMMISSION_RATES = {
    product: 15,  // 15% for physical products
    app: 25,      // 25% for app subscriptions
    package: 35   // 35% for business packages
  };

  /**
   * Get all products from localStorage
   */
  getAllProducts(): Product[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return this.getDefaultProducts();
      
      const products = JSON.parse(stored);
      return products.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading products:', error);
      return this.getDefaultProducts();
    }
  }

  /**
   * Get active products only
   */
  getActiveProducts(): Product[] {
    return this.getAllProducts().filter(product => product.isActive);
  }

  /**
   * Get products by type
   */
  getProductsByType(type: Product['type']): Product[] {
    return this.getAllProducts().filter(product => product.type === type);
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Product | null {
    const products = this.getAllProducts();
    return products.find(product => product.id === id) || null;
  }

  /**
   * Create new product
   */
  createProduct(formData: ProductFormData): Product {
    const newProduct: Product = {
      id: this.generateProductId(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const products = this.getAllProducts();
    products.push(newProduct);
    this.saveProducts(products);

    return newProduct;
  }

  /**
   * Update existing product
   */
  updateProduct(id: string, formData: ProductFormData): Product | null {
    const products = this.getAllProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...formData,
      updatedAt: new Date()
    };

    this.saveProducts(products);
    return products[index];
  }

  /**
   * Delete product
   */
  deleteProduct(id: string): boolean {
    const products = this.getAllProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) return false;
    
    this.saveProducts(filteredProducts);
    return true;
  }

  /**
   * Get default commission rate for product type
   */
  getDefaultCommissionRate(type: Product['type']): number {
    return this.DEFAULT_COMMISSION_RATES[type];
  }

  /**
   * Calculate commission amount
   */
  calculateCommission(productId: string, saleAmount: number): number {
    const product = this.getProductById(productId);
    if (!product) return 0;
    
    return (saleAmount * product.commissionRate) / 100;
  }

  /**
   * Validate product data
   */
  validateProductData(formData: ProductFormData): string[] {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Product name is required');
    }

    if (formData.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (formData.commissionRate < 0 || formData.commissionRate > 100) {
      errors.push('Commission rate must be between 0 and 100');
    }

    if (!formData.category.trim()) {
      errors.push('Category is required');
    }

    return errors;
  }

  /**
   * Private: Generate unique product ID
   */
  private generateProductId(): string {
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Save products to localStorage
   */
  private saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }

  /**
   * Private: Get default products for demo
   */
  private getDefaultProducts(): Product[] {
    return [
      {
        id: 'prod_health_001',
        name: 'MaxPulse Health Supplements',
        type: 'product',
        price: 89.99,
        commissionRate: 15,
        category: 'Health & Wellness',
        description: 'Premium health supplements for daily wellness',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod_app_001',
        name: 'MaxPulse Lifestyle App',
        type: 'app',
        price: 29.99,
        commissionRate: 25,
        category: 'Digital Products',
        description: 'Monthly subscription to MaxPulse lifestyle tracking app',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prod_package_001',
        name: 'Business Builder Package',
        type: 'package',
        price: 299.99,
        commissionRate: 35,
        category: 'Business Opportunity',
        description: 'Complete business starter package with training and tools',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
