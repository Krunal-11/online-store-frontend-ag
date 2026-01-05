import useSWR from 'swr';
import api from '@/lib/api';
import type { ProductListItem, ProductWithDetails, PaginatedResponse, ApiResponse } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Hook for fetching product list with optional filters
export function useProducts(params?: {
  categoryId?: string;
  brandId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params?.brandId) searchParams.set('brandId', params.brandId);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const url = `/products${queryString ? `?${queryString}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<ProductListItem>>(
    url,
    fetcher
  );

  return {
    products: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for fetching single product details
export function useProduct(slugOrId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ProductWithDetails>>(
    slugOrId ? `/products/${slugOrId}` : null,
    fetcher
  );

  return {
    product: data?.data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for fetching related products
export function useRelatedProducts(productId: string | undefined, limit: number = 6) {
  const { data, error, isLoading } = useSWR<ApiResponse<ProductListItem[]>>(
    productId ? `/products/${productId}/related?limit=${limit}` : null,
    fetcher
  );

  return {
    products: data?.data ?? [],
    isLoading,
    isError: !!error,
  };
}
