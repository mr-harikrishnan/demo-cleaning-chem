export type ProductCategory =
  | 'Dishwash Liquid'
  | 'Toilet Cleaner'
  | 'Glass Cleaner'
  | 'Floor Cleaner'
  | 'Kitchen Degreaser'
  | 'Room Freshener'
  | 'Fabric Wash'
  | 'Disinfectant'
  | 'Tile & Surface Cleaner';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  packSize: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  image: string;
  gallery: string[];
  features: string[];
  suitableFor: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt: string;
}

export interface Customer extends User {
  totalOrders: number;
  totalSpent: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export type OrderType = 'online' | 'manual';
export type PaymentMethod = 'online' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'failed';
export type DeliveryStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  packSize: string;
  price: number;
  quantity: number;
  lineTotal: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  amountCollected: number;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'success' | 'pending' | 'failed';
  transactionRef: string;
  paidAt: string;
}

export interface LandingPageSettings {
  featuredProductIds: string[];
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  requirement: string;
  createdAt: string;
}

export interface BrandPromise {
  title: string;
  description: string;
  icon: 'Sparkles' | 'ShieldCheck' | 'Leaf' | 'BedDouble';
}

export interface IndustryServed {
  id: string;
  name: string;
  useCase: string;
  icon: string;
}

export interface SiteContent {
  companyName: string;
  tagline: string;
  headline: string;
  signatureLine: string;
  strapline: string;
  phone: string;
  address: string;
  promises: BrandPromise[];
  industries: IndustryServed[];
  enquiries: Enquiry[];
}
