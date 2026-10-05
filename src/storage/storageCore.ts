export const STORAGE_KEYS = {
  USERS: 'cleantec_users',
  SESSION: 'cleantec_session',
  PRODUCTS: 'cleantec_products',
  CART: 'cleantec_cart',
  ORDERS: 'cleantec_orders',
  CUSTOMERS: 'cleantec_customers',
  LANDING_PAGE: 'cleantec_landing_page',
  SITE_CONTENT: 'cleantec_site_content',
  PAYMENT_RECORDS: 'cleantec_payment_records'
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Central event emitter for inter-tab & intra-tab reactive state updates
const STORAGE_EVENT = 'cleantec_storage_update';

export const emitStorageChange = (key: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
  }
};

export const subscribeToStorage = (callback: (key: string) => void) => {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ key: string }>;
    if (customEvent.detail && customEvent.detail.key) {
      callback(customEvent.detail.key);
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key) {
      callback(e.key);
    }
  };

  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
};

export const getData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading key "${key}" from localStorage:`, err);
    return defaultValue;
  }
};

export const setData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    emitStorageChange(key);
  } catch (err) {
    console.error(`Error writing key "${key}" to localStorage:`, err);
  }
};

export const removeData = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
    emitStorageChange(key);
  } catch (err) {
    console.error(`Error removing key "${key}" from localStorage:`, err);
  }
};

export const updateData = <T>(key: string, updater: (prev: T) => T, defaultValue: T): T => {
  const current = getData<T>(key, defaultValue);
  const updated = updater(current);
  setData<T>(key, updated);
  return updated;
};
