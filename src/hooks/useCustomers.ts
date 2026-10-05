import { useCallback, useEffect, useRef, useState } from 'react';
import { customerService } from '../services';
import { CustomerQueryOptions } from '../storage';
import { Customer } from '../types';

export const useCustomers = (initialOptions: CustomerQueryOptions = {}) => {
  const [options, setOptions] = useState<CustomerQueryOptions>({
    page: 1,
    limit: 10,
    ...initialOptions
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const fetchCustomers = useCallback(async (opts: CustomerQueryOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await customerService.getCustomers(opts);
      if (isMountedRef.current) {
        setCustomers(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        console.error('Failed to load customers in useCustomers:', err);
        setError('Unable to load customer list.');
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
    fetchCustomers(options);
    return () => {
      isMountedRef.current = false;
    };
  }, [options, fetchCustomers]);

  const setPage = (page: number) => {
    setOptions((prev) => ({ ...prev, page }));
  };

  const setSearch = (search: string) => {
    setOptions((prev) => ({ ...prev, search, page: 1 }));
  };

  const setLimit = (limit: number) => {
    setOptions((prev) => ({ ...prev, limit, page: 1 }));
  };

  const refresh = () => {
    fetchCustomers(options);
  };

  return {
    customers,
    total,
    totalPages,
    page: options.page || 1,
    limit: options.limit || 10,
    options,
    isInitialLoad,
    isLoading,
    error,
    setPage,
    setSearch,
    setLimit,
    refresh
  };
};
