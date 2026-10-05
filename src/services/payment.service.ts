import { paymentStorage } from '../storage';
import { PaymentRecord } from '../types';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentService = {
  getPayments: async (): Promise<PaymentRecord[]> => {
    await delay(100);
    return paymentStorage.getAll();
  },

  getPaymentsByOrder: async (orderId: string): Promise<PaymentRecord[]> => {
    await delay(100);
    return paymentStorage.getByOrderId(orderId);
  },

  processDemoPayment: async (data: {
    orderId: string;
    amount: number;
    paymentMethod: 'online' | 'cod';
    transactionRef?: string;
  }): Promise<PaymentRecord> => {
    await delay(300);
    try {
      return paymentStorage.recordPayment(data);
    } catch (err: unknown) {
      console.error('Demo payment error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to complete demo payment.';
      throw new Error(msg);
    }
  }
};
