import { Eye, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { addItem, getItemQuantity, updateQuantity } = useCart();
  const [imgError, setImgError] = useState(false);

  const quantity = getItemQuantity(product.id);

  const handleCardClick = () => {
    navigate(`/products/${product.slug || product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      navigate(`/products/${product.slug || product.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-[18px] border border-[#E6EAF2] hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200 p-3 flex flex-col justify-between cursor-pointer w-full"
    >
      {/* Top Image Container: Balanced 4:3 aspect ratio (not tall/narrow) */}
      <div className="relative w-full aspect-[4/3] bg-[#F8FAFC] rounded-[12px] p-2 sm:p-3 flex items-center justify-center overflow-hidden">
        {/* Quick view button */}
        <button
          onClick={handleQuickView}
          aria-label={`Quick view ${product.name}`}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 border border-[#E6EAF2] flex items-center justify-center text-[#475569] hover:text-[#0B0F19] hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Product studio image */}
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={imgError ? '/images/products/fallback.svg' : product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={240}
            height={180}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Body Section */}
      <div className="pt-3 pb-1 px-1 flex flex-col flex-1">
        {/* Star rating row */}
        <div className="flex items-center gap-1 mb-1">
          <div className="flex items-center text-[#F59E0B]">
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-[10px] text-[#94A3B8] font-medium ml-1">
            (120+ reviews)
          </span>
        </div>

        {/* Product Name */}
        <h4 className="text-[14px] font-bold text-[#0B0F19] leading-snug line-clamp-1 group-hover:text-[#1E40AF] transition-colors" title={product.name}>
          {product.name}
        </h4>

        {/* Category & Pack Size */}
        <p className="mt-0.5 text-[11px] text-[#64748B] truncate">
          {product.packSize} • {product.category}
        </p>

        {/* Bottom row: Price on left, circular cart button on right */}
        <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#F1F5F9]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-extrabold text-[#0B0F19] tabular-nums">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[11px] text-[#94A3B8] line-through tabular-nums">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Cart button or stepper */}
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              aria-label={`Add ${product.name} to cart`}
              className="w-8 h-8 rounded-full bg-[#0B0F19] text-white hover:bg-[#1E293B] active:scale-95 transition-all flex items-center justify-center shadow-sm disabled:opacity-40 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="h-7 px-1.5 rounded-full bg-[#F1F5F9] border border-[#CBD5E1] flex items-center gap-1 select-none"
            >
              <button
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                className="w-4 h-4 rounded-full bg-white text-[#0B0F19] hover:bg-[#0B0F19] hover:text-white transition-colors flex items-center justify-center font-bold text-[10px]"
              >
                <Minus className="w-2 h-2" />
              </button>
              <span className="w-3.5 text-center text-xs font-bold text-[#0B0F19] tabular-nums">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                aria-label="Increase quantity"
                className="w-4 h-4 rounded-full bg-white text-[#0B0F19] hover:bg-[#0B0F19] hover:text-white transition-colors flex items-center justify-center font-bold text-[10px]"
              >
                <Plus className="w-2 h-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
