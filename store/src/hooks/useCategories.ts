import useSWR from 'swr';
import api from '@/lib/api';
import type { Category, ApiResponse } from '@/types';
import type { BreadcrumbItem } from '@/components/common';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Response type for single category endpoint
interface CategoryDetailResponse {
  data: Category;
  subcategories: Category[];
  breadcrumb: BreadcrumbItem[];
}

// Hook for fetching all categories (hierarchical tree)
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Category[]>>(
    '/categories',
    fetcher
  );

  return {
    categories: data?.data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for fetching single category with subcategories and breadcrumb
export function useCategory(slugOrId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<CategoryDetailResponse>(
    slugOrId ? `/categories/${slugOrId}` : null,
    fetcher
  );

  return {
    category: data?.data,
    subcategories: data?.subcategories ?? [],
    breadcrumb: data?.breadcrumb ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook for fetching main (level 0) categories only
export function useMainCategories() {
  const { categories, isLoading, isError, error, mutate } = useCategories();
  
  // Filter to only top-level categories
  const mainCategories = categories.filter((cat) => cat.level === 0);

  return {
    categories: mainCategories,
    isLoading,
    isError,
    error,
    mutate,
  };
}
