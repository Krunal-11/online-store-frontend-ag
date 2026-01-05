import useSWR from 'swr';
import api from '@/lib/api';
import type { WishlistItem, ApiResponse } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Hook for fetching user's wishlist
export function useWishlist() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<WishlistItem[]> & { totalItems: number }>(
    '/wishlist',
    fetcher
  );

  return {
    items: data?.data ?? [],
    totalItems: data?.totalItems ?? 0,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Add item to wishlist
export async function addToWishlist(productGroupId: string, variantId: string) {
  const response = await api.post('/wishlist', { productGroupId, variantId });
  return response.data;
}

// Remove item from wishlist
export async function removeFromWishlist(wishlistItemId: string) {
  const response = await api.delete(`/wishlist/${wishlistItemId}`);
  return response.data;
}

// Check if a product is in wishlist
export function useIsInWishlist(productGroupId: string | undefined, variantId: string | undefined) {
  const { items, isLoading } = useWishlist();
  
  const isInWishlist = items.some(
    (item) => item.productGroupId === productGroupId && item.variantId === variantId
  );

  const wishlistItem = items.find(
    (item) => item.productGroupId === productGroupId && item.variantId === variantId
  );

  return {
    isInWishlist,
    wishlistItem,
    isLoading,
  };
}
