'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useMainCategories, useCategory } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

// Category card skeleton
function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

// Category grid skeleton
function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Category card component with selected state
interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 w-full',
        isSelected
          ? 'bg-primary/10 ring-2 ring-primary'
          : 'hover:bg-gray-50'
      )}
    >
      {/* Category Image */}
      <div className={cn(
        'relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 transition-all duration-200',
        isSelected && 'ring-1 ring-primary/30'
      )}>
        <Image
          src={category.imageUrl || `https://placehold.co/200x200/E5E7EB/6B7280?text=${encodeURIComponent(category.name)}`}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          unoptimized
        />
      </div>
      {/* Category Name with indicator */}
      <div className="flex items-center gap-1">
        <span className={cn(
          'text-sm md:text-base font-medium text-center transition-colors',
          isSelected ? 'text-primary' : 'text-gray-800 group-hover:text-primary'
        )}>
          {category.name}
        </span>
        {/* Show chevron if category has children */}
        {category.children && category.children.length > 0 && (
          <ChevronDown className={cn(
            'h-4 w-4 transition-transform duration-200',
            isSelected ? 'text-primary rotate-180' : 'text-gray-400'
          )} />
        )}
      </div>
    </button>
  );
}

// Subcategory section component
interface SubcategorySectionProps {
  parentCategory: Category;
  subcategories: Category[];
  selectedSubcategorySlug: string | null;
  onSelectSubcategory: (category: Category) => void;
  level: number;
}

function SubcategorySection({ 
  parentCategory, 
  subcategories, 
  selectedSubcategorySlug,
  onSelectSubcategory,
  level 
}: SubcategorySectionProps) {
  return (
    <div className={cn(
      'mt-6 pt-6 border-t border-gray-200',
      level === 1 && 'ml-0 sm:ml-4',
      level === 2 && 'ml-0 sm:ml-8'
    )}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {parentCategory.name}
        </h3>
        <Link
          href={`/category/${parentCategory.slug}/products`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium self-start sm:self-auto"
        >
          View All Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Subcategory Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {subcategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedSubcategorySlug === category.slug}
            onClick={() => onSelectSubcategory(category)}
          />
        ))}
      </div>
    </div>
  );
}

export function CategoryGrid() {
  const router = useRouter();
  const { categories: mainCategories, isLoading: isLoadingMain } = useMainCategories();
  
  // Track expanded categories at each level
  const [expandedLevel0, setExpandedLevel0] = useState<string | null>(null);
  const [expandedLevel1, setExpandedLevel1] = useState<string | null>(null);
  
  // Fetch subcategories for expanded Level 0 category
  const { subcategories: level1Categories, isLoading: isLoadingLevel1 } = useCategory(
    expandedLevel0 || undefined
  );
  
  // Fetch subcategories for expanded Level 1 category
  const { category: level1Category, subcategories: level2Categories, isLoading: isLoadingLevel2 } = useCategory(
    expandedLevel1 || undefined
  );

  // Handle main category (Level 0) click
  const handleLevel0Click = (category: Category) => {
    const hasChildren = category.children && category.children.length > 0;
    
    if (hasChildren) {
      if (expandedLevel0 === category.slug) {
        // Collapse if clicking same category
        setExpandedLevel0(null);
        setExpandedLevel1(null);
      } else {
        // Expand new category, reset Level 1
        setExpandedLevel0(category.slug);
        setExpandedLevel1(null);
      }
    } else {
      // Navigate to products page
      router.push(`/category/${category.slug}/products`);
    }
  };

  // Handle Level 1 subcategory click
  const handleLevel1Click = (category: Category) => {
    const hasChildren = category.children && category.children.length > 0;
    
    if (hasChildren) {
      if (expandedLevel1 === category.slug) {
        // Collapse if clicking same category
        setExpandedLevel1(null);
      } else {
        // Expand new subcategory
        setExpandedLevel1(category.slug);
      }
    } else {
      // Navigate to products page
      router.push(`/category/${category.slug}/products`);
    }
  };

  // Handle Level 2 subcategory click (always navigates, no further nesting)
  const handleLevel2Click = (category: Category) => {
    // Level 2 is the deepest, always navigate to products
    router.push(`/category/${category.slug}/products`);
  };

  // Find the expanded Level 0 category object
  const expandedLevel0Category = mainCategories.find(cat => cat.slug === expandedLevel0);

  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        Browse by Category
      </h2>

      {/* Main Categories Grid (Level 0) - Always visible */}
      {isLoadingMain ? (
        <CategoryGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mainCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={expandedLevel0 === category.slug}
              onClick={() => handleLevel0Click(category)}
            />
          ))}
        </div>
      )}

      {/* Level 1 Subcategories (shown when Level 0 is expanded) */}
      {expandedLevel0 && expandedLevel0Category && (
        isLoadingLevel1 ? (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <CategoryGridSkeleton />
          </div>
        ) : level1Categories.length > 0 ? (
          <SubcategorySection
            parentCategory={expandedLevel0Category}
            subcategories={level1Categories}
            selectedSubcategorySlug={expandedLevel1}
            onSelectSubcategory={handleLevel1Click}
            level={1}
          />
        ) : null
      )}

      {/* Level 2 Subcategories (shown when Level 1 is expanded) */}
      {expandedLevel1 && level1Category && (
        isLoadingLevel2 ? (
          <div className="mt-6 pt-6 border-t border-gray-200 ml-0 sm:ml-4">
            <CategoryGridSkeleton />
          </div>
        ) : level2Categories.length > 0 ? (
          <SubcategorySection
            parentCategory={level1Category}
            subcategories={level2Categories}
            selectedSubcategorySlug={null}
            onSelectSubcategory={handleLevel2Click}
            level={2}
          />
        ) : null
      )}
    </section>
  );
}

export default CategoryGrid;
