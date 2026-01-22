'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { removeFromWishlist, useWishlist } from '@/hooks';
import { formatPrice } from './ProductCard';
import type { WishlistItem } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WishlistProductCardProps {
  wishlistItem: WishlistItem;
  className?: string;
}

export function WishlistProductCard({ wishlistItem, className }: WishlistProductCardProps) {
  const { mutate: refreshWishlist } = useWishlist();
  const product = wishlistItem.product;

  // Handle case where product might be null (deleted/unavailable) or INACTIVE
  const isUnavailable = !product || product.sellingPrice === 0 || product.status === 'INACTIVE';
  
  // Check if product is out of stock
  const isOutOfStock = product && product.stockQuantity === 0;

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await removeFromWishlist(wishlistItem.id);
      refreshWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  // If product data is missing, show unavailable state
  if (isUnavailable) {
    return (
      <div
        className={cn(
          'group relative flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden opacity-75',
          className
        )}
      >
        {/* Remove Button - Always visible for unavailable items */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-red-50 rounded-full shadow-sm text-gray-400 hover:text-red-500"
          onClick={handleRemove}
          aria-label="Remove from wishlist"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Unavailable Badge */}
        <Badge
          variant="destructive"
          className="absolute top-2 left-2 z-10"
        >
          Unavailable
        </Badge>

        {/* Placeholder Image */}
        <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-gray-300" />
        </div>

        {/* Product Info */}
        <div className="flex flex-col p-3 gap-1.5 flex-1">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Product Unavailable
          </span>
          <p className="text-sm text-gray-500">
            This product is no longer available.
          </p>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discountPercentage > 0;

  // Build product URL with variant slug if available
  const productUrl = product.variantSlug
    ? `/products/${product.slug}?variant=${product.variantSlug}`
    : `/products/${product.slug}`;

  return (
    <Link
      href={productUrl}
      className={cn(
        'group relative flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300',
        isOutOfStock && 'opacity-75',
        className
      )}
    >
      {/* Out of Stock Badge - Takes priority over discount */}
      {isOutOfStock ? (
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 z-10 bg-gray-600 text-white hover:bg-gray-600"
        >
          Out of Stock
        </Badge>
      ) : hasDiscount ? (
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 z-10 bg-amber-500 text-white hover:bg-amber-500"
        >
          {product.discountPercentage}% OFF
        </Badge>
      ) : null}

      {/* Remove Button - Top right, visible on hover (desktop) or always (mobile) */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-red-50 rounded-full shadow-sm text-gray-400 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        onClick={handleRemove}
        aria-label="Remove from wishlist"
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Wishlist Heart Indicator - Bottom right of image */}
      <div className="absolute bottom-2 right-2 z-10 bg-white/90 rounded-full p-1.5 shadow-sm">
        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
      </div>

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.primaryImage}
          alt={product.name}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-3 gap-1.5 flex-1">
        {/* Brand */}
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {product.brandName}
        </span>

        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Variant Name */}
        {product.variantName && (
          <span className="text-xs text-gray-500">
            {product.variantName}
          </span>
        )}

        {/* Rating */}
        {product.averageRating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-600">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({product.totalReviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-gray-900">
            {formatPrice(product.sellingPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default WishlistProductCard;
