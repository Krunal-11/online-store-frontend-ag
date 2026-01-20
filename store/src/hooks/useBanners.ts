import useSWR from 'swr';
import api from '@/lib/api';
import type { Banner, ApiResponse } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Hook for fetching active banners
export function useBanners() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Banner[]>>(
    '/banners',
    fetcher
  );

  return {
    banners: data?.data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
