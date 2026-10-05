import { customerStorage, OrderQueryOptions, orderStorage, PaginatedResult } from '../storage';
import { DeliveryStatus, Order, PaymentStatus } from '../types';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const orderService = {
  getOrders: async (options: OrderQueryOptions = {}): Promise<PaginatedResult<Order>> => {
    await delay(150);
    try {
      return orderStorage.query(options);
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw new Error('Failed to retrieve orders. Please try again.');
    }
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    await delay(100);
    return orderStorage.getById(id);
  },

  createOrder: async (input: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    await delay(250);
    try {
      const order = orderStorage.create(input);

      // Upsert customer stats automatically
      customerStorage.upsert({
        id: order.customerId,
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode,
        role: 'customer',
        totalOrders: 1,
        totalSpent: order.amountCollected,
        createdAt: new Date().toISOString()
      });

      return order;
    } catch (err: unknown) {
      console.error('Order creation error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to place order.';
      throw new Error(msg);
    }
  },

  updateStatus: async (
    id: string,
    data: {
      paymentStatus?: PaymentStatus;
      deliveryStatus?: DeliveryStatus;
      amountCollected?: number;
      notes?: string;
    }
  ): Promise<Order> => {
    await delay(150);
    try {
      return orderStorage.updateStatus(id, data);
    } catch (err: unknown) {
      console.error('Order status update error:', err);
      throw new Error('Failed to update order status.');
    }
  }
};
