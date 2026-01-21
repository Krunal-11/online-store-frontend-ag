'use client';

import { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProductListItem } from '@/types';

interface RelatedProductsProps {
  products: ProductListItem[];
  isLoading?: boolean;
  title?: string;
}

export function RelatedProducts({
  products,
  isLoading = false,
  title = 'You May Also Like',
}: RelatedProductsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!emblaApi) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        scrollNext();
      }
    };

    const container = emblaApi.containerNode();
    container.addEventListener('keydown', onKeyDown);

    return () => {
      container.removeEventListener('keydown', onKeyDown);
    };
  }, [emblaApi, scrollPrev, scrollNext]);

  if (isLoading) {
    return <RelatedProductsSkeleton />;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        
        {/* Navigation buttons - desktop */}
        {products.length > 4 && (
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              aria-label="Previous products"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              aria-label="Next products"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div
              key={`${product.id}-${product.slug}`}
              className="flex-[0_0_280px] min-w-0 md:flex-[0_0_calc(25%-12px)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Skeleton for loading state
export function RelatedProductsSkeleton() {
  return (
    <section className="py-8">
      <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex-[0_0_280px] md:flex-[0_0_calc(25%-12px)]"
          >
            <div className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
