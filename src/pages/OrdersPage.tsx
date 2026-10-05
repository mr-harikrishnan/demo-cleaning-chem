import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Package,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { StatusText } from '../components/common/StatusText';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService, productService } from '../services';
import { Order, Product } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrdersPage: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [allCatalogProducts, setAllCatalogProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    productService.getAllProducts().then((res) => setAllCatalogProducts(res));
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    orderService
      .getOrders({
        customerId: currentUser.id,
        limit: 100
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Error fetching customer orders:', err))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleBuyAgain = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = allCatalogProducts.find((p) => p.id === productId);
    if (product) {
      addItem(product, 1);
      showToast(`Added ${product.name} to cart.`, 'success');
    } else {
      showToast('Product information could not be loaded.', 'error');
    }
  };

  // Filter orders based on active tab and search
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab === 'in_progress') {
      if (order.deliveryStatus === 'delivered' || order.deliveryStatus === 'cancelled') return false;
    } else if (activeTab === 'delivered') {
      if (order.deliveryStatus !== 'delivered') return false;
    } else if (activeTab === 'cancelled') {
      if (order.deliveryStatus !== 'cancelled') return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
      const matchItem = order.items.some((i) => i.productName.toLowerCase().includes(q));
      return matchOrderNum || matchItem;
    }

    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0B0F19]">Sign in to View Orders</h2>
        <p className="mt-2 text-xs sm:text-sm text-[#64748B]">
          Please log in to review your order history, live dispatch status, and download invoices.
        </p>
        <Link
          to="/login?redirect=/orders"
          className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-[10px] bg-[#0B0F19] text-white text-xs font-bold hover:bg-[#1E293B] transition-colors"
        >
          Sign In to Your Account
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-[85vh]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb / Top Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <Link to="/" className="hover:underline">Home</Link>
            <span>›</span>
            <span className="text-[#0B0F19] font-medium">Your Account</span>
            <span>›</span>
            <span className="text-[#0B0F19] font-bold">Your Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
            Your Orders
          </h1>
          <p className="mt-0.5 text-xs text-[#64748B]">
            Track shipments, review past chemical supplies, or buy items again.
          </p>
        </div>

        {/* Toolbar: Search & Filter Tabs (Amazon / Flipkart Style) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 border-b border-[#E2E8F0] pb-2 sm:pb-0 sm:border-none overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-[8px] transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#0B0F19] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0B0F19] hover:bg-white'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-4 py-2 text-xs font-bold rounded-[8px] transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'in_progress'
                  ? 'bg-[#0B0F19] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0B0F19] hover:bg-white'
              }`}
            >
              In Progress / Dispatched
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-4 py-2 text-xs font-bold rounded-[8px] transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'delivered'
                  ? 'bg-[#0B0F19] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0B0F19] hover:bg-white'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 py-2 text-xs font-bold rounded-[8px] transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'cancelled'
                  ? 'bg-[#0B0F19] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0B0F19] hover:bg-white'
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search all orders or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-xs bg-white rounded-[8px] border border-[#CBD5E1] focus:border-[#0B0F19] outline-none shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0B0F19]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="h-44 bg-white rounded-[14px] border border-[#E2E8F0] animate-pulse" />
            <div className="h-44 bg-white rounded-[14px] border border-[#E2E8F0] animate-pulse" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-10 text-center">
            <EmptyState
              icon={<ShoppingBag className="w-12 h-12 text-[#94A3B8]" />}
              title={searchTerm ? 'No matching orders found' : 'No orders in this category'}
              description={
                searchTerm
                  ? `We couldn't find any orders matching "${searchTerm}". Try searching by order number or product name.`
                  : 'You do not have any orders matching the selected status.'
              }
              actionText="View All Products"
              onAction={() => navigate('/products')}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredOrders.map((ord) => {
              const isDelivered = ord.deliveryStatus === 'delivered';
              const isCancelled = ord.deliveryStatus === 'cancelled';
              const isOutForDelivery = ord.deliveryStatus === 'out_for_delivery';

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-[12px] border border-[#D5D9D9] shadow-sm hover:border-[#94A3B8] transition-all overflow-hidden"
                >
                  {/* Top Order Strip (Amazon Header Style) */}
                  <div className="bg-[#F0F2F2] px-4 sm:px-6 py-3 border-b border-[#D5D9D9] flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs text-[#565959]">
                    <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                      <div>
                        <span className="uppercase text-[10px] block font-bold text-[#565959]">
                          Order Placed
                        </span>
                        <span className="font-semibold text-[#0F1111]">
                          {formatDate(ord.createdAt)}
                        </span>
                      </div>

                      <div>
                        <span className="uppercase text-[10px] block font-bold text-[#565959]">
                          Total
                        </span>
                        <span className="font-bold text-[#0F1111] tabular-nums">
                          {formatCurrency(ord.total)}
                        </span>
                      </div>

                      <div className="hidden sm:block">
                        <span className="uppercase text-[10px] block font-bold text-[#565959]">
                          Ship To
                        </span>
                        <span className="font-semibold text-[#0F1111] truncate max-w-[180px] block" title={ord.shippingAddress?.name}>
                          {ord.shippingAddress?.name || ord.customerName}
                        </span>
                      </div>

                      <div className="hidden md:block">
                        <span className="uppercase text-[10px] block font-bold text-[#565959]">
                          Payment
                        </span>
                        <span className="font-bold text-[#15803D]">
                          Full Paid (100%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto text-right">
                      <div>
                        <span className="uppercase text-[10px] block font-bold text-[#565959]">
                          Order # {ord.orderNumber}
                        </span>
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            to={`/orders/${ord.id}`}
                            className="text-[#007185] hover:text-[#C7511F] hover:underline font-bold"
                          >
                            View order details
                          </Link>
                          <span>|</span>
                          <Link
                            to={`/orders/${ord.id}`}
                            className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium"
                          >
                            Invoice
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-4 sm:p-6 flex flex-col gap-6">
                    {/* Status Row */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-2">
                        {isDelivered ? (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-[#15803D]">
                            <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
                            <span>Delivered directly to facility</span>
                          </div>
                        ) : isCancelled ? (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-[#DC2626]">
                            <AlertCircle className="w-5 h-5 text-[#DC2626]" />
                            <span>Order Cancelled</span>
                          </div>
                        ) : isOutForDelivery ? (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-[#2563EB]">
                            <Truck className="w-5 h-5 text-[#2563EB]" />
                            <span>Out for Delivery with CleanTec Fleet</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-sm font-bold text-[#D97706]">
                            <Clock className="w-5 h-5 text-[#D97706]" />
                            <span>Processing & Dispatching from Warehouse</span>
                          </div>
                        )}
                      </div>

                      <StatusText status={ord.deliveryStatus} />
                    </div>

                    {/* Ordered Items List with Amazon/Flipkart Layout */}
                    <div className="flex flex-col gap-4">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 last:pb-0 border-b last:border-b-0 border-[#F1F5F9]"
                        >
                          {/* Product Image & Details */}
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-20 h-20 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] p-1.5 flex items-center justify-center shrink-0">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>

                            <div className="flex flex-col gap-0.5">
                              <Link
                                to={`/products/${item.productId}`}
                                className="text-sm font-bold text-[#0B0F19] hover:text-[#1E40AF] transition-colors leading-snug line-clamp-2"
                              >
                                {item.productName}
                              </Link>
                              <div className="text-xs text-[#64748B]">
                                Pack Size: <span className="font-semibold text-[#0B0F19]">{item.packSize}</span>
                                {' • '}
                                Qty: <span className="font-semibold text-[#0B0F19]">{item.quantity}</span>
                              </div>
                              <div className="text-xs font-bold text-[#0B0F19] mt-0.5 tabular-nums">
                                {formatCurrency(item.price)} each • Total: {formatCurrency(item.lineTotal)}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons (Right Column) */}
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto justify-end">
                            <Link
                              to={`/orders/${ord.id}`}
                              className="w-full sm:w-36 h-8 rounded-[8px] bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] text-xs font-bold flex items-center justify-center transition-colors shadow-sm text-center"
                            >
                              Track Package
                            </Link>

                            <button
                              onClick={(e) => handleBuyAgain(item.productId, e)}
                              className="w-full sm:w-36 h-8 rounded-[8px] bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] text-[#0F1111] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3 text-[#0F1111]" />
                              <span>Buy it again</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
