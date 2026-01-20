import useSWR from 'swr';
import api from '@/lib/api';
import type { Brand, ApiResponse } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Hook for fetching all brands
export function useBrands() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Brand[]>>(
    '/brands',
    fetcher
  );

  return {
    brands: data?.data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for fetching a single brand by slug or id
export function useBrand(slugOrId: string | undefined) {
  const { brands, isLoading, isError } = useBrands();
  
  const brand = brands.find(
    (b) => b.slug === slugOrId || b.id === slugOrId
  );

  return {
    brand,
    isLoading,
    isError,
  };
}
