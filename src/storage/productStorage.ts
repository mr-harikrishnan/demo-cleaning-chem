import { Product } from '../types';
import { getData, STORAGE_KEYS, updateData } from './storageCore';

export interface ProductQueryOptions {
  category?: string;
  search?: string;
  activeOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'newest';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productStorage = {
  getAll: (): Product[] => {
    return getData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  },

  query: (options: ProductQueryOptions = {}): PaginatedResult<Product> => {
    let items = productStorage.getAll();

    if (options.activeOnly !== false) {
      items = items.filter((p) => p.isActive);
    }

    if (options.category && options.category !== 'All') {
      items = items.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
    }

    if (options.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (options.minPrice !== undefined) {
      items = items.filter((p) => p.price >= (options.minPrice ?? 0));
    }

    if (options.maxPrice !== undefined) {
      items = items.filter((p) => p.price <= (options.maxPrice ?? Infinity));
    }

    if (options.sortBy) {
      if (options.sortBy === 'price-asc') {
        items.sort((a, b) => a.price - b.price);
      } else if (options.sortBy === 'price-desc') {
        items.sort((a, b) => b.price - a.price);
      } else if (options.sortBy === 'name-asc') {
        items.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options.sortBy === 'newest') {
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    const total = items.length;
    const page = Math.max(1, options.page || 1);
    const limit = options.limit || 12;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  getById: (id: string): Product | null => {
    if (!id) return null;
    const items = productStorage.getAll();
    return items.find((p) => p.id === id) || null;
  },

  getBySlug: (slug: string): Product | null => {
    if (!slug) return null;
    const items = productStorage.getAll();
    return items.find((p) => p.slug === slug || p.id === slug) || null;
  },

  create: (input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    if (!input.name || !input.category || !input.price) {
      throw new Error('Product name, category, and price are required.');
    }

    const now = new Date().toISOString();
    const id = `prod-${Date.now()}`;
    const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      ...input,
      id,
      slug,
      gallery: input.gallery && input.gallery.length > 0 ? input.gallery : [input.image],
      createdAt: now,
      updatedAt: now
    };

    updateData<Product[]>(STORAGE_KEYS.PRODUCTS, (prev) => [newProduct, ...prev], []);
    return newProduct;
  },

  update: (id: string, updates: Partial<Product>): Product => {
    if (!id) {
      throw new Error('Product ID is required.');
    }

    let updated: Product | null = null;
    updateData<Product[]>(
      STORAGE_KEYS.PRODUCTS,
      (prev) => {
        return prev.map((p) => {
          if (p.id === id) {
            updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
            return updated;
          }
          return p;
        });
      },
      []
    );

    if (!updated) {
      throw new Error('Product not found.');
    }

    return updated;
  },

  delete: (id: string): boolean => {
    if (!id) return false;
    let existed = false;
    updateData<Product[]>(
      STORAGE_KEYS.PRODUCTS,
      (prev) => {
        const filtered = prev.filter((p) => p.id !== id);
        existed = filtered.length !== prev.length;
        return filtered;
      },
      []
    );
    return existed;
  },

  toggleStatus: (id: string): Product => {
    const p = productStorage.getById(id);
    if (!p) throw new Error('Product not found.');
    return productStorage.update(id, { isActive: !p.isActive });
  }
};
