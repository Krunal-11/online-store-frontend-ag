'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Sort images by displayOrder
  const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Carousel */}
      <div className="relative group">
        <div className="overflow-hidden rounded-lg bg-gray-50" ref={emblaRef}>
          <div className="flex">
            {sortedImages.map((image, index) => (
              <div
                key={image.id}
                className="relative flex-[0_0_100%] min-w-0 aspect-square"
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${productName} - Image ${index + 1}`}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Show on hover (desktop) */}
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white hidden md:flex"
              onClick={scrollPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white hidden md:flex"
              onClick={scrollNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Dot Indicators - Mobile */}
        {sortedImages.length > 1 && (
          <div className="flex justify-center gap-2 mt-3 md:hidden">
            {sortedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === selectedIndex ? 'bg-primary' : 'bg-gray-300'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails - Desktop */}
      {sortedImages.length > 1 && (
        <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => scrollTo(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                index === selectedIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.altText || `Thumbnail ${index + 1}`}
                fill
                className="object-contain p-1"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Skeleton for loading state
export function ProductImageGallerySkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
      <div className="hidden md:flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-20 h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
