import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { OrderSummary } from '../components/cart/OrderSummary';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export const CartPage: React.FC = () => {
  const { items, subtotal, deliveryFee, total, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <EmptyState
            icon={<ShoppingBag className="w-12 h-12" />}
            title="Your commercial order cart is empty"
            description="Explore our specialized range of hotel and commercial cleaning chemicals to place an order."
            actionText="Explore Product Range"
            onAction={() => navigate('/products')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-8 flex items-baseline justify-between border-b border-[#E6EAF2] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#12338F]">
              Procurement Cart
            </span>
            <h1 className="text-3xl font-extrabold text-[#0A1F5C] mt-1">Review Your Order</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-[#DC2626] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Items Table / List (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white rounded-[16px] border border-[#E6EAF2] overflow-hidden shadow-cleantec-sm">
              <div className="p-4 bg-[#F8FAFC] border-b border-[#E6EAF2] grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                <div className="col-span-6 sm:col-span-6">Product Details</div>
                <div className="col-span-3 sm:col-span-3 text-center">Quantity</div>
                <div className="col-span-3 sm:col-span-3 text-right">Line Total</div>
              </div>

              <div className="divide-y divide-[#E6EAF2]">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-5 grid grid-cols-12 items-center gap-4 hover:bg-[#F7F9FC]/40 transition-colors"
                  >
                    {/* Product Info (6 cols) */}
                    <div className="col-span-6 sm:col-span-6 flex items-center gap-4">
                      <div className="w-16 h-20 rounded-[10px] bg-[#F7F9FC] border border-[#E6EAF2] p-1.5 shrink-0 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/products/${product.slug || product.id}`}
                          className="text-sm font-bold text-[#0A1F5C] hover:text-[#1F6FEB] transition-colors truncate block"
                        >
                          {product.name}
                        </Link>
                        <span className="text-xs text-[#94A3B8] font-medium block mt-0.5">
                          Pack: {product.packSize}
                        </span>
                        <span className="text-xs font-semibold text-[#475569] tabular-nums mt-1 block">
                          {formatCurrency(product.price)} each
                        </span>
                      </div>
                    </div>

                    {/* Stepper (3 cols) */}
                    <div className="col-span-3 sm:col-span-3 flex items-center justify-center">
                      <div className="h-9 px-2 rounded-[8px] bg-[#F1F4F9] border border-[#E6EAF2] flex items-center gap-2 select-none">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded text-xs font-bold text-[#0A1F5C] hover:bg-white flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#0A1F5C] tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 rounded text-xs font-bold text-[#0A1F5C] hover:bg-white flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove (3 cols) */}
                    <div className="col-span-3 sm:col-span-3 flex items-center justify-end gap-3 text-right">
                      <span className="text-base font-bold text-[#0A1F5C] tabular-nums">
                        {formatCurrency(product.price * quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#DC2626] transition-colors rounded-[6px]"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link to="/products">
                <Button variant="ghost" size="sm">
                  ← Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <OrderSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              actionText="Proceed to Checkout"
              actionVariant="green"
              onAction={() => navigate('/checkout')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
