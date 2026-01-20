'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsInWishlist, addToWishlist, removeFromWishlist, useWishlist } from '@/hooks';
import type { ProductListItem } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ProductListItem;
  className?: string;
}

// Format price in Indian Rupee format
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function ProductCard({ product, className }: ProductCardProps) {
  const { isInWishlist, wishlistItem, isLoading: wishlistLoading } = useIsInWishlist(
    product.productGroupId,
    product.id
  );
  const { mutate: refreshWishlist } = useWishlist();

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isInWishlist && wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
      } else {
        await addToWishlist(product.productGroupId, product.id);
      }
      refreshWishlist();
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  const hasDiscount = product.discountPercentage > 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        'group relative flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300',
        className
      )}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 z-10 bg-amber-500 text-white hover:bg-amber-500"
        >
          {product.discountPercentage}% OFF
        </Badge>
      )}

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all',
          isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        )}
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={cn('h-5 w-5', isInWishlist && 'fill-current')} />
      </Button>

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

// Skeleton loader for product card
export function ProductCardSkeleton() {
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

export default ProductCard;
