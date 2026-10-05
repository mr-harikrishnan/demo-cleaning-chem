import { DeliveryStatus, Order, PaymentStatus } from '../types';
import { PaginatedResult } from './productStorage';
import { getData, STORAGE_KEYS, updateData } from './storageCore';

export interface OrderQueryOptions {
  type?: 'online' | 'manual' | 'all';
  paymentStatus?: string;
  deliveryStatus?: string;
  search?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export const orderStorage = {
  getAll: (): Order[] => {
    return getData<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  query: (options: OrderQueryOptions = {}): PaginatedResult<Order> => {
    let items = orderStorage.getAll();

    if (options.customerId) {
      items = items.filter((o) => o.customerId === options.customerId);
    }

    if (options.type && options.type !== 'all') {
      items = items.filter((o) => o.orderType === options.type);
    }

    if (options.paymentStatus && options.paymentStatus !== 'all') {
      items = items.filter((o) => o.paymentStatus === options.paymentStatus);
    }

    if (options.deliveryStatus && options.deliveryStatus !== 'all') {
      items = items.filter((o) => o.deliveryStatus === options.deliveryStatus);
    }

    if (options.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      items = items.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q) ||
          o.items.some((i) => i.productName.toLowerCase().includes(q))
      );
    }

    // Sort by newest order first
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  getById: (id: string): Order | null => {
    if (!id) return null;
    const items = orderStorage.getAll();
    return items.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  create: (input: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order => {
    if (!input.items || input.items.length === 0) {
      throw new Error('An order must have at least one product.');
    }
    if (!input.customerName) {
      throw new Error('Customer name is required.');
    }

    const count = orderStorage.getAll().length + 1;
    const orderNumber = `CT-2026-${1000 + count}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...input,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now,
      updatedAt: now
    };

    updateData<Order[]>(STORAGE_KEYS.ORDERS, (prev) => [newOrder, ...prev], []);
    return newOrder;
  },

  update: (id: string, updates: Partial<Order>): Order => {
    if (!id) throw new Error('Order ID is required.');

    let updated: Order | null = null;
    updateData<Order[]>(
      STORAGE_KEYS.ORDERS,
      (prev) => {
        return prev.map((o) => {
          if (o.id === id) {
            let nextCollected = updates.amountCollected !== undefined ? updates.amountCollected : o.amountCollected;
            let nextPaymentStatus = updates.paymentStatus || o.paymentStatus;

            // Auto-calculate payment status if collected amount updated
            if (updates.amountCollected !== undefined) {
              if (nextCollected >= o.total) {
                nextPaymentStatus = 'paid';
              } else if (nextCollected > 0) {
                nextPaymentStatus = 'partially_paid';
              } else {
                nextPaymentStatus = 'pending';
              }
            }

            updated = {
              ...o,
              ...updates,
              amountCollected: nextCollected,
              paymentStatus: nextPaymentStatus,
              updatedAt: new Date().toISOString()
            };
            return updated;
          }
          return o;
        });
      },
      []
    );

    if (!updated) {
      throw new Error('Order not found.');
    }

    return updated;
  },

  updateStatus: (
    id: string,
    data: {
      paymentStatus?: PaymentStatus;
      deliveryStatus?: DeliveryStatus;
      amountCollected?: number;
      notes?: string;
    }
  ): Order => {
    return orderStorage.update(id, data);
  }
};
