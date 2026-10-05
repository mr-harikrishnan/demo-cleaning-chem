import {
  INITIAL_CUSTOMERS,
  INITIAL_LANDING_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SITE_CONTENT,
  INITIAL_USERS
} from '../data/seedData';
import { PaymentRecord, Product } from '../types';
import { getData, removeData, setData, STORAGE_KEYS } from './storageCore';

export const initializeSeedData = (forceReset = false): void => {
  if (forceReset) {
    Object.values(STORAGE_KEYS).forEach((k) => removeData(k));
  }

  // Seed Users
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setData(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  // Seed Products & Sync 4K Studio Image Paths
  const existingProducts = getData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  if (existingProducts.length === 0) {
    setData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  } else {
    const updated = existingProducts.map((p) => {
      const match = INITIAL_PRODUCTS.find((init) => init.id === p.id);
      if (match && match.image) {
        return { ...p, image: match.image, gallery: match.gallery };
      }
      return p;
    });
    setData(STORAGE_KEYS.PRODUCTS, updated);
  }

  // Seed Landing Page Settings
  if (!localStorage.getItem(STORAGE_KEYS.LANDING_PAGE)) {
    setData(STORAGE_KEYS.LANDING_PAGE, INITIAL_LANDING_SETTINGS);
  }

  // Seed Site Content
  if (!localStorage.getItem(STORAGE_KEYS.SITE_CONTENT)) {
    setData(STORAGE_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT);
  }

  // Seed Customers
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    setData(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }

  // Seed & Sync Orders (Enforce 100% Full Payment for Online Orders)
  const existingOrders = getData<any[]>(STORAGE_KEYS.ORDERS, []);
  if (existingOrders.length === 0) {
    setData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const updatedOrders = existingOrders.map((ord) => {
      const updatedItems = (ord.items || []).map((it: any) => {
        const prod = INITIAL_PRODUCTS.find((p) => p.id === it.productId);
        return prod ? { ...it, image: prod.image } : it;
      });

      if (ord.id === 'ord-1002' || ord.paymentStatus === 'partially_paid') {
        return {
          ...ord,
          items: updatedItems,
          paymentStatus: 'paid',
          amountCollected: ord.total,
          paymentMethod: 'online',
          notes: 'Full online payment verified via UPI. Dispatched with CleanTec Priority Delivery.'
        };
      }
      return { ...ord, items: updatedItems };
    });
    setData(STORAGE_KEYS.ORDERS, updatedOrders);
  }

  // Seed & Sync Payments
  const existingPayments = getData<PaymentRecord[]>(STORAGE_KEYS.PAYMENT_RECORDS, []);
  if (existingPayments.length === 0) {
    const initialPayments: PaymentRecord[] = [
      {
        id: 'pay-1001',
        orderId: 'ord-1001',
        orderNumber: 'CT-2026-1001',
        amount: 1020,
        paymentMethod: 'online',
        status: 'success',
        transactionRef: 'UPI-DEMO-9823412',
        paidAt: '2026-02-01T10:20:00.000Z'
      },
      {
        id: 'pay-1002',
        orderId: 'ord-1002',
        orderNumber: 'CT-2026-1002',
        amount: 875,
        paymentMethod: 'online',
        status: 'success',
        transactionRef: 'UPI-FULL-875',
        paidAt: '2026-02-08T14:45:00.000Z'
      },
      {
        id: 'pay-1003',
        orderId: 'ord-1003',
        orderNumber: 'CT-2026-1003',
        amount: 4200,
        paymentMethod: 'online',
        status: 'success',
        transactionRef: 'BANK-TRANSFER-4200',
        paidAt: '2026-02-09T16:10:00.000Z'
      }
    ];
    setData(STORAGE_KEYS.PAYMENT_RECORDS, initialPayments);
  } else {
    const updatedPayments = existingPayments.map((p) => {
      if (p.id === 'pay-1002') {
        return { ...p, amount: 875, paymentMethod: 'online', transactionRef: 'UPI-FULL-875' };
      }
      return p;
    });
    setData(STORAGE_KEYS.PAYMENT_RECORDS, updatedPayments);
  }
};

export const resetAllDemoData = (): void => {
  initializeSeedData(true);
};
