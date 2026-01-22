'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '@/context';
import { useWishlist } from '@/hooks';
import { WishlistProductCard } from '@/components/products';
import { ProductEmptyState } from '@/components/products';
import { Skeleton } from '@/components/ui/skeleton';
import type { WishlistItem } from '@/types';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, totalItems, isLoading: wishlistLoading, isError } = useWishlist();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?returnUrl=/wishlist');
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="container-main py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container-main py-6 md:py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-full">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Wishlist
          </h1>
          {!wishlistLoading && (
            <p className="text-sm text-gray-500">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} saved
            </p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {wishlistLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <WishlistCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !wishlistLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load wishlist. Please try again.</p>
        </div>
      )}

      {/* Empty State */}
      {!wishlistLoading && !isError && items.length === 0 && (
        <ProductEmptyState
          title="Your wishlist is empty"
          message="Save items you love by clicking the heart icon on any product. They'll appear here for easy access."
          showHomeButton={true}
        />
      )}

      {/* Wishlist Grid */}
      {!wishlistLoading && !isError && items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item: WishlistItem) => (
            <WishlistProductCard
              key={item.id}
              wishlistItem={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Skeleton for wishlist card loading state
function WishlistCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col p-3 gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-20 mt-2" />
      </div>
    </div>
  );
}
