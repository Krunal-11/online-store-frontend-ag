'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBanners } from '@/hooks';
import type { Banner } from '@/types';
import { cn } from '@/lib/utils';

// Get link URL based on banner link type
const getBannerLink = (banner: Banner): string => {
  switch (banner.linkType) {
    case 'CATEGORY':
      return `/category/${banner.linkValue}`;
    case 'BRAND':
      return `/brand/${banner.linkValue}`;
    case 'PRODUCT':
      return `/product/${banner.linkValue}`;
    case 'EXTERNAL':
      return banner.linkValue;
    default:
      return '/';
  }
};

// Dot indicator component
function DotIndicators({
  count,
  current,
  onSelect,
}: {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={cn(
            'w-2.5 h-2.5 rounded-full transition-all duration-300',
            index === current
              ? 'bg-white scale-110'
              : 'bg-white/50 hover:bg-white/75'
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

// Banner skeleton loader
function BannerSkeleton() {
  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[21/7]">
      <Skeleton className="absolute inset-0 rounded-lg" />
    </div>
  );
}

export function HeroBanner() {
  const { banners, isLoading } = useBanners();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [api, setApi] = React.useState<ReturnType<typeof import('embla-carousel').default> | null>(null);

  // Autoplay plugin - 5 second interval
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  // Update current slide indicator when slide changes
  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect(); // Initial call

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Navigation handlers
  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (isLoading) {
    return <BannerSkeleton />;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full group">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[autoplayPlugin.current]}
        setApi={(emblaApi) => setApi(emblaApi as ReturnType<typeof import('embla-carousel').default>)}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="pl-0">
              <Link href={getBannerLink(banner)} className="block relative">
                {/* Desktop Image */}
                <div className="hidden md:block relative w-full aspect-[21/7]">
                  <Image
                    src={banner.imageUrlDesktop || `https://placehold.co/1400x400/0F766E/FFFFFF?text=${encodeURIComponent(banner.title)}`}
                    alt={banner.title}
                    fill
                    className="object-cover rounded-lg"
                    priority={banners.indexOf(banner) === 0}
                    sizes="100vw"
                    unoptimized
                  />
                </div>
                {/* Mobile Image */}
                <div className="block md:hidden relative w-full aspect-[16/9]">
                  <Image
                    src={banner.imageUrlMobile || `https://placehold.co/800x450/0F766E/FFFFFF?text=${encodeURIComponent(banner.title)}`}
                    alt={banner.title}
                    fill
                    className="object-cover rounded-lg"
                    priority={banners.indexOf(banner) === 0}
                    sizes="100vw"
                    unoptimized
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows - Desktop only, show on hover */}
        {banners.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex rounded-full shadow-md"
              onClick={scrollPrev}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex rounded-full shadow-md"
              onClick={scrollNext}
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Dot Indicators */}
        {banners.length > 1 && (
          <DotIndicators
            count={banners.length}
            current={currentSlide}
            onSelect={scrollTo}
          />
        )}
      </Carousel>
    </div>
  );
}

export default HeroBanner;
