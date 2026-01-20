import { useState, useCallback, useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import api from '@/lib/api';
import type { ProductListItem, PaginatedResponse } from '@/types';

// Get products per page from environment variable
const PRODUCTS_PER_PAGE = parseInt(
  process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE || '30',
  10
);

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Sort options type
export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'discount' | 'newest';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'discount', label: 'Discount' },
  { value: 'newest', label: 'Newest First' },
];

interface UseInfiniteProductsParams {
  categoryId?: string;
  brandId?: string;
  search?: string;
  sort?: SortOption;
}

export function useInfiniteProducts(params?: UseInfiniteProductsParams) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [loadMoreRef, setLoadMoreRef] = useState<HTMLDivElement | null>(null);

  // Build the key for each page
  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedResponse<ProductListItem> | null
  ) => {
    // If previous page has no more data, stop
    if (previousPageData && !previousPageData.pagination?.hasNextPage) {
      return null;
    }

    const searchParams = new URLSearchParams();
    searchParams.set('page', (pageIndex + 1).toString());
    searchParams.set('limit', PRODUCTS_PER_PAGE.toString());
    
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params?.brandId) searchParams.set('brandId', params.brandId);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sort) searchParams.set('sort', params.sort);

    return `/products?${searchParams.toString()}`;
  };

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<PaginatedResponse<ProductListItem>>(getKey, fetcher, {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    });

  // Flatten all pages into a single products array
  const products = data ? data.flatMap((page) => page.data) : [];
  
  // Check if there are more pages to load
  const hasMore = data ? data[data.length - 1]?.pagination?.hasNextPage ?? false : false;
  
  // Check if currently loading more
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  // Get total count from first page
  const totalItems = data?.[0]?.pagination?.totalItems ?? 0;

  // Load next page
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      setSize((prev) => prev + 1);
    }
  }, [isLoadingMore, hasMore, setSize]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // When the sentinel element is visible, load more
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        // Start loading when we're 200px from the bottom
        rootMargin: '200px',
      }
    );

    observerRef.current.observe(loadMoreRef);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreRef, hasMore, isLoadingMore, loadMore]);

  return {
    products,
    isLoading,
    isLoadingMore,
    isError: !!error,
    error,
    hasMore,
    totalItems,
    loadMore,
    setLoadMoreRef,
    mutate,
  };
}
