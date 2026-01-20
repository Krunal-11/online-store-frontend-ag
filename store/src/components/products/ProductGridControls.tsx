'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SORT_OPTIONS } from '@/hooks';
import type { SortOption } from '@/hooks';
import type { Brand } from '@/types';
import { cn } from '@/lib/utils';

interface ProductGridControlsProps {
  // Sort
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  
  // Brand filter
  brands?: Brand[];
  selectedBrandId?: string;
  onBrandChange?: (brandId: string | undefined) => void;
  showBrandFilter?: boolean;
  
  // Product count
  totalItems: number;
  
  // Clear filters
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  
  className?: string;
}

export function ProductGridControls({
  sort,
  onSortChange,
  brands = [],
  selectedBrandId,
  onBrandChange,
  showBrandFilter = true,
  totalItems,
  hasActiveFilters = false,
  onClearFilters,
  className,
}: ProductGridControlsProps) {
  return (
    <div
      className={cn(
        'sticky top-[64px] md:top-[64px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 -mx-4 px-4 py-3 mb-4',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left side: Product count + Clear filters */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{totalItems}</span>{' '}
            {totalItems === 1 ? 'product' : 'products'}
          </p>
          
          {hasActiveFilters && onClearFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Right side: Sort + Filter controls */}
        <div className="flex items-center gap-3">
          {/* Brand Filter */}
          {showBrandFilter && brands.length > 0 && (
            <Select
              value={selectedBrandId || 'all'}
              onValueChange={(value) => onBrandChange?.(value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-[140px] sm:w-[160px] h-9 text-sm">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort Dropdown */}
          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="w-[140px] sm:w-[180px] h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default ProductGridControls;
