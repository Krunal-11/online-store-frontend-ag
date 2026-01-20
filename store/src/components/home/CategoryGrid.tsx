'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMainCategories } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';

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

export function CategoryGrid() {
  const { categories, isLoading } = useMainCategories();

  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        Browse by Category
      </h2>

      {isLoading ? (
        <CategoryGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Category Image */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={category.imageUrl || `https://placehold.co/200x200/E5E7EB/6B7280?text=${encodeURIComponent(category.name)}`}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  unoptimized
                />
              </div>
              {/* Category Name */}
              <span className="text-sm md:text-base font-medium text-gray-800 text-center group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryGrid;
