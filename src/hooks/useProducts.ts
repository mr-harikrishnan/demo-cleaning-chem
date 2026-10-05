import { useCallback, useEffect, useRef, useState } from 'react';
import { productService } from '../services';
import { ProductQueryOptions } from '../storage';
import { Product } from '../types';

export const useProducts = (initialOptions: ProductQueryOptions = {}) => {
  const [options, setOptions] = useState<ProductQueryOptions>({
    page: 1,
    limit: 12,
    activeOnly: true,
    ...initialOptions
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const fetchProducts = useCallback(async (opts: ProductQueryOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await productService.getProducts(opts);
      if (isMountedRef.current) {
        setProducts(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        console.error('Failed to load products in useProducts:', err);
        setError('Unable to load products. Please check your connection.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchProducts(options);
    return () => {
      isMountedRef.current = false;
    };
  }, [options, fetchProducts]);

  const setPage = (page: number) => {
    setOptions((prev) => ({ ...prev, page }));
  };

  const setSearch = (search: string) => {
    setOptions((prev) => ({ ...prev, search, page: 1 }));
  };

  const setCategory = (category?: string) => {
    setOptions((prev) => ({ ...prev, category, page: 1 }));
  };

  const setSortBy = (sortBy?: ProductQueryOptions['sortBy']) => {
    setOptions((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const setPriceRange = (minPrice?: number, maxPrice?: number) => {
    setOptions((prev) => ({ ...prev, minPrice, maxPrice, page: 1 }));
  };

  const setLimit = (limit: number) => {
    setOptions((prev) => ({ ...prev, limit, page: 1 }));
  };

  const refresh = () => {
    fetchProducts(options);
  };

  return {
    products,
    total,
    totalPages,
    page: options.page || 1,
    limit: options.limit || 12,
    options,
    isInitialLoad,
    isLoading,
    error,
    setPage,
    setSearch,
    setCategory,
    setSortBy,
    setPriceRange,
    setLimit,
    refresh
  };
};
