'use client';

import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onVariantChange: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  if (variants.length <= 1) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Select Variant</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isInStock = variant.stockQuantity > 0;

          return (
            <button
              key={variant.id}
              onClick={() => onVariantChange(variant.id)}
              disabled={!isInStock}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                isSelected
                  ? 'bg-primary text-white border-primary'
                  : isInStock
                  ? 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
              )}
              aria-pressed={isSelected}
              aria-label={`${variant.name}${!isInStock ? ' - Out of stock' : ''}`}
            >
              {variant.name}
              {!isInStock && <span className="sr-only"> (Out of stock)</span>}
            </button>
          );
        })}
      </div>
      
      {/* Stock status for selected variant */}
      {variants.find((v) => v.id === selectedVariantId)?.stockQuantity === 0 && (
        <p className="text-sm text-red-600">This variant is currently out of stock</p>
      )}
    </div>
  );
}

// Skeleton for loading state
export function VariantSelectorSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    </div>
  );
}
