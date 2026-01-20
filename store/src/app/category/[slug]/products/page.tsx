'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { useCategory, useInfiniteProducts } from '@/hooks';
import { Breadcrumb } from '@/components/common';
import { ProductCard, ProductCardSkeleton } from '@/components/home';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryProductsPageProps {
  params: Promise<{ slug: string }>;
}

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

// Empty state component
function EmptyState({ categoryName }: { categoryName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <Package className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No products available
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        There are no products in &quot;{categoryName}&quot; at the moment. 
        Please check back later or browse other categories.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}

// Loading more indicator
function LoadingMore() {
  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center gap-2 text-gray-500">
        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading more products...</span>
      </div>
    </div>
  );
}

export default function CategoryProductsPage({ params }: CategoryProductsPageProps) {
  const { slug } = use(params);
  
  // Fetch category details for breadcrumb and title
  const { category, breadcrumb, isLoading: isCategoryLoading } = useCategory(slug);
  
  // Fetch products with infinite scroll
  const {
    products,
    isLoading: isProductsLoading,
    isLoadingMore,
    hasMore,
    totalItems,
    setLoadMoreRef,
  } = useInfiniteProducts({ categoryId: category?.id });

  // Initial loading state
  if (isCategoryLoading || (isProductsLoading && products.length === 0)) {
    return (
      <div className="container-main py-6">
        {/* Breadcrumb skeleton */}
        <Skeleton className="h-5 w-48 mb-4" />
        
        {/* Title skeleton */}
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-32 mb-6" />
        
        {/* Products grid skeleton */}
        <ProductsGridSkeleton />
      </div>
    );
  }

  // Category not found
  if (!category) {
    return (
      <div className="container-main py-6">
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Category Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumb} className="mb-4" />

      {/* Category Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          {category.name}
        </h1>
        {totalItems > 0 && (
          <p className="text-gray-500 mt-1">
            {totalItems} {totalItems === 1 ? 'product' : 'products'} found
          </p>
        )}
      </div>

      {/* Products Grid or Empty State */}
      {products.length === 0 && !isProductsLoading ? (
        <EmptyState categoryName={category.name} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Sentinel */}
          {hasMore && (
            <div ref={setLoadMoreRef}>
              {isLoadingMore && <LoadingMore />}
            </div>
          )}

          {/* End of results message */}
          {!hasMore && products.length > 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">
              You&apos;ve seen all {totalItems} products
            </p>
          )}
        </>
      )}
    </div>
  );
}
