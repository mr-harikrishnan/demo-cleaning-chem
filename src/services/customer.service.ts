import { CustomerQueryOptions, customerStorage, orderStorage, PaginatedResult } from '../storage';
import { Customer, Order } from '../types';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const customerService = {
  getCustomers: async (options: CustomerQueryOptions = {}): Promise<PaginatedResult<Customer>> => {
    await delay(150);
    try {
      return customerStorage.query(options);
    } catch (err) {
      console.error('Error fetching customers:', err);
      throw new Error('Failed to retrieve customer accounts.');
    }
  },

  getCustomerById: async (id: string): Promise<{ customer: Customer | null; orders: Order[] }> => {
    await delay(100);
    const customer = customerStorage.getById(id);
    if (!customer) {
      return { customer: null, orders: [] };
    }

    const orders = orderStorage.getAll().filter(
      (o) => o.customerId === customer.id || o.customerEmail.toLowerCase() === customer.email.toLowerCase()
    );

    return { customer, orders };
  }
};
