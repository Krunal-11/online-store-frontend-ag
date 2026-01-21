'use client';

import { useState } from 'react';
import { Heart, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useWishlist, addToWishlist, removeFromWishlist } from '@/hooks';
import { useAuth } from '@/context';
import type { ProductVariant, WishlistItem } from '@/types';

interface ProductInfoProps {
  productGroupId: string;
  name: string;
  brandName: string;
  selectedVariant: ProductVariant;
  averageRating: number;
  reviewCount: number;
  description: string;
}

export function ProductInfo({
  productGroupId,
  name,
  brandName,
  selectedVariant,
  averageRating,
  reviewCount,
  description,
}: ProductInfoProps) {
  const { user } = useAuth();
  const { items: wishlist, isLoading: wishlistLoading, mutate: refreshWishlist } = useWishlist();
  const [isWishlistUpdating, setIsWishlistUpdating] = useState(false);

  // Check if this specific variant is in wishlist
  const wishlistItem = wishlist?.find(
    (item: WishlistItem) => item.productGroupId === productGroupId && item.variantId === selectedVariant.id
  );
  const isInWishlist = !!wishlistItem;

  const handleWishlistToggle = async () => {
    if (!user) {
      // Could trigger auth modal here
      return;
    }

    setIsWishlistUpdating(true);
    try {
      if (isInWishlist && wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
      } else {
        await addToWishlist(productGroupId, selectedVariant.id);
      }
      refreshWishlist();
    } finally {
      setIsWishlistUpdating(false);
    }
  };

  const discountPercentage = selectedVariant.discountPercentage;

  const isOutOfStock = selectedVariant.stockQuantity === 0;

  return (
    <div className="space-y-4">
      {/* Brand */}
      <p className="text-sm text-gray-500 uppercase tracking-wide">{brandName}</p>

      {/* Product Name */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{name}</h1>

      {/* Variant Name */}
      <p className="text-lg text-gray-600">{selectedVariant.name}</p>

      {/* Rating */}
      {reviewCount > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-sm text-gray-500">
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-3xl font-bold text-gray-900">
          ₹{selectedVariant.sellingPrice.toLocaleString('en-IN')}
        </span>
        {discountPercentage > 0 && (
          <>
            <span className="text-xl text-gray-400 line-through">
              ₹{selectedVariant.mrp.toLocaleString('en-IN')}
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {discountPercentage}% off
            </Badge>
          </>
        )}
      </div>

      {/* Stock Status */}
      {isOutOfStock ? (
        <Badge variant="destructive">Out of Stock</Badge>
      ) : selectedVariant.stockQuantity <= 5 ? (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
          Only {selectedVariant.stockQuantity} left in stock
        </Badge>
      ) : null}

      {/* Add to Wishlist Button */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="lg"
          className={cn(
            'gap-2',
            isInWishlist && 'text-red-500 border-red-200 hover:bg-red-50'
          )}
          onClick={handleWishlistToggle}
          disabled={!user || isWishlistUpdating || wishlistLoading}
        >
          {isWishlistUpdating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className={cn('h-5 w-5', isInWishlist && 'fill-current')} />
          )}
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Button>
        {!user && (
          <p className="text-sm text-gray-500 mt-2">Sign in to add to wishlist</p>
        )}
      </div>

      {/* Description */}
      <div className="pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Skeleton for loading state
export function ProductInfoSkeleton() {
  return (
    <div className="space-y-4">
      {/* Brand */}
      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      
      {/* Name */}
      <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
      
      {/* Variant */}
      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
      
      {/* Rating */}
      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
      
      {/* Price */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* Button */}
      <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
      
      {/* Description */}
      <div className="pt-4 border-t space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
