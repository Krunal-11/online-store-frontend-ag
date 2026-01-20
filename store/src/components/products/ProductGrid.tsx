'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useInfiniteProducts, useBrands } from '@/hooks';
import type { SortOption } from '@/hooks';
import { ProductCard } from './ProductCard';
import { ProductGridControls } from './ProductGridControls';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import { ProductEmptyState } from './ProductEmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  // Data source params
  categoryId?: string;
  brandId?: string;
  search?: string;
  
  // Customization
  showControls?: boolean;
  showBrandFilter?: boolean;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  showSearchSuggestion?: boolean;
  
  // Optional header content (rendered above controls)
  header?: React.ReactNode;
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

export function ProductGrid({
  categoryId,
  brandId: propBrandId,
  search,
  showControls = true,
  showBrandFilter = true,
  emptyStateTitle,
  emptyStateMessage,
  showSearchSuggestion = false,
  header,
}: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get sort and brand from URL params
  const sort = (searchParams.get('sort') as SortOption) || 'relevance';
  const urlBrandId = searchParams.get('brand') || undefined;
  
  // Use prop brandId if provided, otherwise use URL param
  const activeBrandId = propBrandId || urlBrandId;
  
  // Fetch brands for filter dropdown
  const { brands, isLoading: brandsLoading } = useBrands();
  
  // Fetch products with current filters
  const {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    totalItems,
    setLoadMoreRef,
  } = useInfiniteProducts({
    categoryId,
    brandId: activeBrandId,
    search,
    sort,
  });

  // Update URL params helper
  const updateUrlParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      updateUrlParams({ sort: newSort === 'relevance' ? undefined : newSort });
    },
    [updateUrlParams]
  );

  // Handle brand filter change
  const handleBrandChange = useCallback(
    (newBrandId: string | undefined) => {
      updateUrlParams({ brand: newBrandId });
    },
    [updateUrlParams]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    updateUrlParams({ sort: undefined, brand: undefined });
  }, [updateUrlParams]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return sort !== 'relevance' || !!urlBrandId;
  }, [sort, urlBrandId]);

  // Determine if we should show brand filter
  // Don't show if brandId was passed as prop (already filtering by brand)
  const shouldShowBrandFilter = showBrandFilter && !propBrandId;

  // Initial loading state - show header skeleton + grid skeleton
  if (isLoading && products.length === 0) {
    return (
      <div>
        {header}
        {showControls && (
          <div className="sticky top-[64px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 -mx-4 px-4 py-3 mb-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <div className="flex gap-3">
                {shouldShowBrandFilter && <Skeleton className="h-9 w-[140px]" />}
                <Skeleton className="h-9 w-[140px]" />
              </div>
            </div>
          </div>
        )}
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  // Empty state
  if (products.length === 0 && !isLoading) {
    return (
      <div>
        {header}
        {showControls && (
          <ProductGridControls
            sort={sort}
            onSortChange={handleSortChange}
            brands={shouldShowBrandFilter ? brands : []}
            selectedBrandId={urlBrandId}
            onBrandChange={handleBrandChange}
            showBrandFilter={shouldShowBrandFilter}
            totalItems={0}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        )}
        <ProductEmptyState
          title={emptyStateTitle}
          message={emptyStateMessage}
          showSearchSuggestion={showSearchSuggestion}
        />
      </div>
    );
  }

  return (
    <div>
      {header}
      
      {/* Controls bar */}
      {showControls && (
        <ProductGridControls
          sort={sort}
          onSortChange={handleSortChange}
          brands={shouldShowBrandFilter ? brands : []}
          selectedBrandId={urlBrandId}
          onBrandChange={handleBrandChange}
          showBrandFilter={shouldShowBrandFilter && !brandsLoading}
          totalItems={totalItems}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Products Grid */}
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
    </div>
  );
}

export default ProductGrid;
