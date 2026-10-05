import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Drawer } from '../common/Drawer';
import { EmptyState } from '../common/EmptyState';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart, items, count, subtotal, deliveryFee, total, updateQuantity, removeItem } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      title="Your Cart"
      subtitle={`${count} ${count === 1 ? 'item' : 'items'} selected`}
      width="md"
      footer={
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5 text-xs text-[#475569]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#0F172A] tabular-nums">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-[#0F172A] tabular-nums">
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E6EAF2] flex justify-between text-sm font-bold text-[#0A1F5C]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" size="md" onClick={handleViewCart}>
                View Full Cart
              </Button>
              <Button
                variant="green"
                size="md"
                onClick={handleCheckout}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Checkout
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Your cart is empty"
          description="Browse our hospitality cleaning catalog and add commercial solutions to your order."
          actionText="Browse Products"
          onAction={() => {
            closeCart();
            navigate('/products');
          }}
          className="border-0 shadow-none py-10"
        />
      ) : (
        <div className="divide-y divide-[#E6EAF2]">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-3">
              <div className="w-16 h-20 rounded-[10px] bg-[#F7F9FC] border border-[#E6EAF2] p-1.5 shrink-0 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-bold text-[#0A1F5C] truncate">{product.name}</h5>
                <span className="text-xs text-[#94A3B8] font-medium">{product.packSize}</span>
                <div className="mt-1 font-semibold text-xs text-[#0F172A] tabular-nums">
                  {formatCurrency(product.price)} each
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="h-7 px-2 rounded-[6px] bg-[#F1F4F9] flex items-center gap-2 select-none text-xs">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="text-[#0A1F5C] hover:text-[#1F6FEB] font-bold px-1"
                    >
                      -
                    </button>
                    <span className="font-bold text-[#0A1F5C] tabular-nums">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="text-[#0A1F5C] hover:text-[#1F6FEB] font-bold px-1"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-1 text-[#94A3B8] hover:text-[#DC2626] transition-colors rounded-[4px]"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-[#0A1F5C] tabular-nums">
                  {formatCurrency(product.price * quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};
