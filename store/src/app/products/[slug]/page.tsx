'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Breadcrumb } from '@/components/common';
import {
  ProductImageGallery,
  ProductImageGallerySkeleton,
  VariantSelector,
  VariantSelectorSkeleton,
  ProductInfo,
  ProductInfoSkeleton,
  ProductAccordion,
  ProductAccordionSkeleton,
  RelatedProducts,
} from '@/components/products';
import { Button } from '@/components/ui/button';
import { useProduct, useRelatedProducts } from '@/hooks';
import type { ProductVariant, ProductImage } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const slug = params.slug as string;
  const variantSlug = searchParams.get('variant');

  const { product, isLoading, isError, error, mutate } = useProduct(slug);
  const { products: relatedProducts, isLoading: relatedLoading } = useRelatedProducts(
    product?.id
  );

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Set initial selected variant based on URL or default
  useEffect(() => {
    if (!product) return;

    if (variantSlug) {
      // Find variant by slug from URL
      const variant = product.variants.find((v) => v.slug === variantSlug);
      if (variant) {
        setSelectedVariant(variant);
      } else {
        // Variant not found, use default
        setSelectedVariant(product.variants[0]);
        toast.error('Selected variant not found, showing default');
      }
    } else {
      // No variant in URL, use first variant
      setSelectedVariant(product.variants[0]);
    }
  }, [product, variantSlug]);

  // Update URL when variant changes
  const handleVariantChange = useCallback(
    (variantId: string) => {
      if (!product) return;

      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) {
        setSelectedVariant(variant);
        // Update URL with new variant slug (shallow navigation)
        const newUrl = `/products/${slug}?variant=${variant.slug}`;
        router.replace(newUrl, { scroll: false });
      }
    },
    [product, slug, router]
  );

  // Get images for selected variant
  const getVariantImages = useCallback((): ProductImage[] => {
    if (!product || !selectedVariant) return [];

    // Return images from the selected variant
    return selectedVariant.images.length > 0 ? selectedVariant.images : (product.images || []);
  }, [product, selectedVariant]);

  // Handle retry on error
  const handleRetry = () => {
    mutate();
  };

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          {error?.message || 'Failed to load product details'}
        </p>
        <Button onClick={handleRetry}>Try Again</Button>
      </div>
    );
  }

  // Loading state
  if (isLoading || !product || !selectedVariant) {
    return (
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb skeleton */}
        <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column - Image gallery skeleton */}
          <ProductImageGallerySkeleton />

          {/* Right column - Product info skeleton */}
          <div className="lg:sticky lg:top-24 lg:self-start space-py-6">
            <ProductInfoSkeleton />
            <VariantSelectorSkeleton />
            <ProductAccordionSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', slug: '/' },
    ...(product.category
      ? [{ name: product.category.name, slug: product.category.slug }]
      : []),
    { name: product.name, slug: product.slug },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Main product content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column - Image gallery */}
          <div>
            <ProductImageGallery
              images={getVariantImages()}
              productName={product.name}
            />
          </div>

          {/* Right column - Product info (sticky on desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Product info */}
            <ProductInfo
              productGroupId={product.id}
              name={product.name}
              brandName={product.brand.name}
              selectedVariant={selectedVariant}
              averageRating={product.averageRating}
              reviewCount={product.totalReviews}
              description={product.description}
            />

            {/* Variant selector */}
            <VariantSelector
              variants={product.variants}
              selectedVariantId={selectedVariant.id}
              onVariantChange={handleVariantChange}
            />

            {/* Accordion sections */}
            <ProductAccordion selectedVariant={selectedVariant} />
          </div>
        </div>

      {/* Related products */}
      <RelatedProducts products={relatedProducts} isLoading={relatedLoading} />
    </div>
  );
}
