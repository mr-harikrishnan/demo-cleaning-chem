import { Customer } from '../types';
import { orderStorage } from './orderStorage';
import { PaginatedResult } from './productStorage';
import { getData, STORAGE_KEYS, updateData } from './storageCore';

export interface CustomerQueryOptions {
  search?: string;
  page?: number;
  limit?: number;
}

export const customerStorage = {
  getAll: (): Customer[] => {
    const rawCustomers = getData<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const orders = orderStorage.getAll();

    // Recalculate totals dynamically from active orders
    return rawCustomers.map((cust) => {
      const custOrders = orders.filter((o) => o.customerId === cust.id || o.customerEmail.toLowerCase() === cust.email.toLowerCase());
      const totalOrders = custOrders.length;
      const totalSpent = custOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : o.amountCollected), 0);

      return {
        ...cust,
        totalOrders: Math.max(cust.totalOrders || 0, totalOrders),
        totalSpent: Math.max(cust.totalSpent || 0, totalSpent)
      };
    });
  },

  query: (options: CustomerQueryOptions = {}): PaginatedResult<Customer> => {
    let items = customerStorage.getAll();

    if (options.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone && c.phone.includes(q)) ||
          (c.city && c.city.toLowerCase().includes(q))
      );
    }

    const total = items.length;
    const page = Math.max(1, options.page || 1);
    const limit = options.limit || 10;
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

  getById: (id: string): Customer | null => {
    if (!id) return null;
    const customers = customerStorage.getAll();
    return customers.find((c) => c.id === id || c.email.toLowerCase() === id.toLowerCase()) || null;
  },

  upsert: (customer: Customer): Customer => {
    updateData<Customer[]>(
      STORAGE_KEYS.CUSTOMERS,
      (prev) => {
        const idx = prev.findIndex((c) => c.id === customer.id || c.email.toLowerCase() === customer.email.toLowerCase());
        if (idx > -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], ...customer };
          return next;
        }
        return [...prev, customer];
      },
      []
    );
    return customer;
  }
};
