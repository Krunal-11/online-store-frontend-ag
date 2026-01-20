import useSWR from 'swr';
import api from '@/lib/api';
import type { ProductListItem, ApiResponse } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Hook for fetching featured products
export function useFeaturedProducts(limit: number = 8) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ProductListItem[]>>(
    `/products?featured=true&limit=${limit}`,
    fetcher
  );

  return {
    products: data?.data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
