import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Printer,
  RotateCcw,
  ShieldCheck,
  Truck
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { StatusText } from '../components/common/StatusText';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService, productService } from '../services';
import { Order, Product } from '../types';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAllProducts().then((res) => setCatalogProducts(res));
  }, []);

  useEffect(() => {
    if (!id) return;
    orderService
      .getOrderById(id)
      .then((res) => setOrder(res))
      .catch((err) => console.error('Error fetching order:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuyAgain = (productId: string) => {
    const product = catalogProducts.find((p) => p.id === productId);
    if (product) {
      addItem(product, 1);
      showToast(`Added ${product.name} to cart.`, 'success');
    } else {
      showToast('Product information could not be retrieved.', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-16 flex flex-col gap-6">
        <div className="h-6 w-36 bg-[#E2E8F0] animate-pulse rounded-[6px]" />
        <div className="h-44 w-full bg-[#E2E8F0] animate-pulse rounded-[14px]" />
        <div className="h-64 w-full bg-[#E2E8F0] animate-pulse rounded-[14px]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-20 text-center">
        <Package className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#0B0F19]">Order Not Found</h2>
        <p className="mt-2 text-xs text-[#64748B]">
          We could not locate this order in our commercial dispatch database.
        </p>
        <Link to="/orders" className="inline-block mt-6">
          <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const deliverySteps = [
    { key: 'pending', label: 'Ordered', desc: formatDate(order.createdAt) },
    { key: 'confirmed', label: 'Confirmed', desc: 'Stock reserved' },
    { key: 'packed', label: 'Packed & Tested', desc: 'Thiruverkadu Hub' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'CleanTec Dedicated Fleet' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed to receiver' }
  ];

  const getStepIndex = (status: string) => {
    const map: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      packed: 2,
      out_for_delivery: 3,
      delivered: 4,
      cancelled: -1
    };
    return map[status] !== undefined ? map[status] : 0;
  };

  const currentStep = getStepIndex(order.deliveryStatus);
  const isDelivered = order.deliveryStatus === 'delivered';
  const isCancelled = order.deliveryStatus === 'cancelled';

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-[85vh]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Amazon-style Breadcrumb & Header Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <Link to="/orders" className="hover:underline text-[#007185] font-semibold flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                <span>Your Orders</span>
              </Link>
              <span>›</span>
              <span className="text-[#0B0F19] font-bold">Order Details</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
                Order Details
              </h1>
              <span className="text-xs text-[#64748B]">
                Ordered on {formatDate(order.createdAt)} • Order #{order.orderNumber}
              </span>
            </div>
          </div>

          {/* Action buttons (Print / Invoice) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-[8px] bg-white border border-[#D5D9D9] hover:bg-[#F7FAFA] text-xs font-semibold text-[#0F1111] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Order</span>
            </button>
            <button
              onClick={() => showToast('Downloading Official Tax Invoice (GST)...', 'info')}
              className="px-3.5 py-1.5 rounded-[8px] bg-white border border-[#D5D9D9] hover:bg-[#F7FAFA] text-xs font-semibold text-[#0F1111] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* 3-Column Summary Card (Amazon Standard Order Summary) */}
        <div className="bg-white rounded-[12px] border border-[#D5D9D9] p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
            {/* Column 1: Shipping Address */}
            <div className="flex flex-col gap-1 pr-0 md:pr-4">
              <span className="text-xs font-bold uppercase text-[#0B0F19] mb-1">
                Shipping Address
              </span>
              <p className="text-xs font-bold text-[#0F1111]">
                {order.shippingAddress?.name || order.customerName}
              </p>
              <p className="text-xs text-[#565959] leading-relaxed">
                {order.shippingAddress?.address}
              </p>
              <p className="text-xs text-[#565959]">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-xs text-[#565959] font-medium mt-1">
                Phone: {order.shippingAddress?.phone}
              </p>
            </div>

            {/* Column 2: Payment Method */}
            <div className="flex flex-col gap-1 pt-4 md:pt-0 px-0 md:px-4">
              <span className="text-xs font-bold uppercase text-[#0B0F19] mb-1">
                Payment Details
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0F1111]">
                  {order.paymentMethod === 'online' ? 'Online Payment (UPI / Card)' : 'Cash on Delivery'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#15803D]">
                  100% Full Paid
                </span>
              </div>
              <p className="text-xs text-[#565959] mt-1">
                Amount Paid: <strong className="text-[#0B0F19] tabular-nums">{formatCurrency(order.amountCollected || order.total)}</strong>
              </p>
              <p className="text-xs text-[#565959]">
                Balance Pending: <strong className="text-[#15803D]">₹0.00 (Zero Balance)</strong>
              </p>
              <p className="text-[11px] text-[#64748B] mt-1 italic">
                {order.notes || 'Full payment verified on checkout.'}
              </p>
            </div>

            {/* Column 3: Order Financial Breakdown */}
            <div className="flex flex-col gap-1.5 pt-4 md:pt-0 pl-0 md:pl-4 text-xs">
              <span className="font-bold uppercase text-[#0B0F19] mb-1">
                Order Summary
              </span>
              <div className="flex justify-between text-[#565959]">
                <span>Items Subtotal:</span>
                <span className="tabular-nums font-semibold text-[#0F1111]">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#565959]">
                <span>Commercial Delivery:</span>
                <span className="tabular-nums font-semibold text-[#15803D]">
                  {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#565959]">
                <span>Applicable GST:</span>
                <span className="tabular-nums text-[#0F1111]">Included</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between font-extrabold text-sm text-[#0B0F19]">
                <span>Grand Total:</span>
                <span className="tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Delivery Tracking Timeline (Amazon / Flipkart Style) */}
        <div className="bg-white rounded-[12px] border border-[#D5D9D9] p-5 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] mb-6 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#0B0F19] uppercase tracking-wide">
                  Package Tracking Status
                </h3>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Carrier: CleanTec Dedicated Commercial Fleet • Dispatch Hub: Thiruverkadu, Chennai
              </p>
            </div>
            <div>
              <StatusText status={order.deliveryStatus} />
            </div>
          </div>

          {!isCancelled ? (
            <div className="py-2">
              <div className="relative">
                {/* Horizontal line for desktop */}
                <div className="hidden sm:block absolute top-5 left-10 right-10 h-1 bg-[#E2E8F0] -z-0">
                  <div
                    className="h-full bg-[#15803D] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, (currentStep / (deliverySteps.length - 1)) * 100))}%`
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {deliverySteps.map((step, idx) => {
                    const isPassed = currentStep > idx;
                    const isCurrent = currentStep === idx;

                    return (
                      <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-sm ${
                            isPassed
                              ? 'bg-[#15803D] text-white'
                              : isCurrent
                              ? 'bg-[#0B0F19] text-white ring-4 ring-[#E2E8F0]'
                              : 'bg-[#F1F5F9] text-[#94A3B8] border border-[#CBD5E1]'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>

                        <div className="flex flex-col sm:items-center">
                          <span
                            className={`text-xs ${
                              isPassed || isCurrent ? 'font-bold text-[#0B0F19]' : 'font-medium text-[#94A3B8]'
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="text-[10px] text-[#64748B]">{step.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-[8px] bg-red-50 text-[#DC2626] font-semibold text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>This order has been cancelled and will not be dispatched.</span>
            </div>
          )}
        </div>

        {/* Items in this Shipment Card */}
        <div className="bg-white rounded-[12px] border border-[#D5D9D9] p-5 sm:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#0B0F19] uppercase tracking-wide pb-3 border-b border-[#E2E8F0] mb-4">
            Items in this Shipment ({order.items.length})
          </h3>

          <div className="flex flex-col divide-y divide-[#E2E8F0]">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Details */}
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
                      className="text-sm font-bold text-[#0B0F19] hover:text-[#1E40AF] transition-colors leading-snug"
                    >
                      {item.productName}
                    </Link>
                    <span className="text-xs text-[#64748B]">
                      Pack Size: <span className="font-semibold text-[#0B0F19]">{item.packSize}</span>
                      {' • '}
                      Quantity: <span className="font-semibold text-[#0B0F19]">{item.quantity}</span>
                    </span>
                    <span className="text-xs font-bold text-[#0B0F19] mt-0.5 tabular-nums">
                      {formatCurrency(item.price)} each • Total: {formatCurrency(item.lineTotal)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleBuyAgain(item.productId)}
                    className="px-4 py-2 rounded-[8px] bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Buy it again</span>
                  </button>

                  <Link
                    to={`/products/${item.productId}`}
                    className="px-4 py-2 rounded-[8px] bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] text-[#0F1111] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>View Product</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
