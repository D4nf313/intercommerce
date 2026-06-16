import { memo } from 'react';
import type { Product } from '../../types/index';
import SkeletonCard from '../ui/SkeletonCard';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  skeletonCount?: number;
  onAddToCart: (product: Product) => void;
}

const ProductGrid = memo(({ products, isLoading, skeletonCount = 12, onAddToCart }: ProductGridProps) => {

  return (
    <>
      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 480px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1200px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .product-grid__empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 48px 0;
          color: #6b7280;
          font-size: 15px;
        }
      `}</style>

      <div className="product-grid">
        {isLoading
          ? Array.from({ length: skeletonCount }, (_, i) => <SkeletonCard key={i} />)
          : products.length === 0
            ? <p className="product-grid__empty">No se encontraron productos.</p>
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))
        }
      </div>
    </>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
