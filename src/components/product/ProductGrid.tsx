import React from 'react';
import { Product } from '../../types';
import { CardSkeleton } from '../common/Skeleton';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  onQuickView?: (product: Product) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  skeletonCount = 6,
  onQuickView,
  columns = 3,
  className = ''
}) => {
  if (isLoading) {
    return <CardSkeleton count={skeletonCount} />;
  }

  const colClasses =
    columns === 4
      ? 'grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6'
      : columns === 2
      ? 'grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6'
      : 'grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6';

  return (
    <div className={`${colClasses} ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
};
