'use client';

import { useFeaturedProducts } from '@/hooks';
import { ProductCard, ProductCardSkeleton } from '@/components/products';

// Products grid skeleton
function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FeaturedProducts() {
  const { products, isLoading } = useFeaturedProducts(8);

  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        Featured Products
      </h2>

      {isLoading ? (
        <ProductsGridSkeleton />
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No featured products available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;
