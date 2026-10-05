import { useCallback, useEffect, useRef, useState } from 'react';
import { orderService } from '../services';
import { OrderQueryOptions } from '../storage';
import { Order } from '../types';

export const useOrders = (initialOptions: OrderQueryOptions = {}) => {
  const [options, setOptions] = useState<OrderQueryOptions>({
    page: 1,
    limit: 10,
    type: 'all',
    ...initialOptions
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const fetchOrders = useCallback(async (opts: OrderQueryOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await orderService.getOrders(opts);
      if (isMountedRef.current) {
        setOrders(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        console.error('Failed to load orders in useOrders:', err);
        setError('Unable to load orders. Please try again.');
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
    fetchOrders(options);
    return () => {
      isMountedRef.current = false;
    };
  }, [options, fetchOrders]);

  const setPage = (page: number) => {
    setOptions((prev) => ({ ...prev, page }));
  };

  const setSearch = (search: string) => {
    setOptions((prev) => ({ ...prev, search, page: 1 }));
  };

  const setType = (type: 'all' | 'online' | 'manual') => {
    setOptions((prev) => ({ ...prev, type, page: 1 }));
  };

  const setPaymentStatus = (paymentStatus?: string) => {
    setOptions((prev) => ({ ...prev, paymentStatus, page: 1 }));
  };

  const setDeliveryStatus = (deliveryStatus?: string) => {
    setOptions((prev) => ({ ...prev, deliveryStatus, page: 1 }));
  };

  const setLimit = (limit: number) => {
    setOptions((prev) => ({ ...prev, limit, page: 1 }));
  };

  const refresh = () => {
    fetchOrders(options);
  };

  return {
    orders,
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
    setType,
    setPaymentStatus,
    setDeliveryStatus,
    setLimit,
    refresh
  };
};
