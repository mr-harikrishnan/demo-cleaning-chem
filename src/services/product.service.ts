import { landingPageStorage, PaginatedResult, ProductQueryOptions, productStorage } from '../storage';
import { Product } from '../types';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  getProducts: async (options: ProductQueryOptions = {}): Promise<PaginatedResult<Product>> => {
    await delay(150);
    try {
      return productStorage.query(options);
    } catch (err) {
      console.error('Error fetching products:', err);
      throw new Error('Failed to load products. Please refresh the page.');
    }
  },

  getAllProducts: async (): Promise<Product[]> => {
    await delay(100);
    return productStorage.getAll();
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    await delay(100);
    const { featuredProductIds } = landingPageStorage.getSettings();
    const all = productStorage.getAll();
    const map = new Map(all.map((p) => [p.id, p]));
    return featuredProductIds
      .map((id) => map.get(id))
      .filter((p): p is Product => Boolean(p && p.isActive));
  },

  getProductById: async (id: string): Promise<Product | null> => {
    await delay(100);
    return productStorage.getById(id);
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    await delay(100);
    return productStorage.getBySlug(slug);
  },

  createProduct: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await delay(200);
    try {
      return productStorage.create(data);
    } catch (err: unknown) {
      console.error('Create product error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to create product.';
      throw new Error(msg);
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await delay(150);
    try {
      return productStorage.update(id, updates);
    } catch (err: unknown) {
      console.error('Update product error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to update product.';
      throw new Error(msg);
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    await delay(150);
    try {
      return productStorage.delete(id);
    } catch (err) {
      console.error('Delete product error:', err);
      throw new Error('Unable to delete product.');
    }
  },

  toggleProductStatus: async (id: string): Promise<Product> => {
    await delay(100);
    try {
      return productStorage.toggleStatus(id);
    } catch (err) {
      console.error('Toggle product status error:', err);
      throw new Error('Unable to update product status.');
    }
  }
};
