import { PaymentRecord } from '../types';
import { orderStorage } from './orderStorage';
import { getData, STORAGE_KEYS, updateData } from './storageCore';

export const paymentStorage = {
  getAll: (): PaymentRecord[] => {
    return getData<PaymentRecord[]>(STORAGE_KEYS.PAYMENT_RECORDS, []);
  },

  getByOrderId: (orderId: string): PaymentRecord[] => {
    return paymentStorage.getAll().filter((p) => p.orderId === orderId);
  },

  recordPayment: (data: {
    orderId: string;
    amount: number;
    paymentMethod: 'online' | 'cod';
    transactionRef?: string;
  }): PaymentRecord => {
    const order = orderStorage.getById(data.orderId);
    if (!order) {
      throw new Error('Order not found for recording payment.');
    }

    const record: PaymentRecord = {
      id: `pay-${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: 'success',
      transactionRef: data.transactionRef || `DEMO-PAY-${Date.now().toString().slice(-6)}`,
      paidAt: new Date().toISOString()
    };

    updateData<PaymentRecord[]>(STORAGE_KEYS.PAYMENT_RECORDS, (prev) => [record, ...prev], []);

    // Also update order collected amount and payment status
    const currentCollected = order.amountCollected || 0;
    const nextCollected = currentCollected + data.amount;
    orderStorage.update(order.id, {
      amountCollected: nextCollected
    });

    return record;
  }
};
