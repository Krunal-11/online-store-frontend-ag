'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { useCategory } from '@/hooks';
import { Breadcrumb } from '@/components/common';
import type { BreadcrumbItem } from '@/components/common';
import { ProductGrid, ProductGridSkeleton } from '@/components/products';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryProductsPageProps {
  params: Promise<{ slug: string }>;
}

// Category header component
function CategoryHeader({
  categoryName,
  breadcrumb,
}: {
  categoryName: string;
  breadcrumb: BreadcrumbItem[];
}) {
  return (
    <>
      <Breadcrumb items={breadcrumb} className="mb-4" />
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          {categoryName}
        </h1>
      </div>
    </>
  );
}

// Loading skeleton for the page
function PageSkeleton() {
  return (
    <div className="container-main py-6">
      <Skeleton className="h-5 w-48 mb-4" />
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="sticky top-[64px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 -mx-4 px-4 py-3 mb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-3">
            <Skeleton className="h-9 w-[140px]" />
            <Skeleton className="h-9 w-[140px]" />
          </div>
        </div>
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}

// Inner component that uses searchParams
function CategoryProductsContent({ slug }: { slug: string }) {
  // Fetch category details for breadcrumb and title
  const { category, breadcrumb, isLoading: isCategoryLoading } = useCategory(slug);

  // Initial loading state for category
  if (isCategoryLoading) {
    return <PageSkeleton />;
  }

  // Category not found
  if (!category) {
    return (
      <div className="container-main py-6">
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Category Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-6">
      <ProductGrid
        categoryId={category.id}
        showBrandFilter={true}
        emptyStateTitle="No products available"
        emptyStateMessage={`There are no products in "${category.name}" at the moment. Please check back later or browse other categories.`}
        header={
          <CategoryHeader
            categoryName={category.name}
            breadcrumb={breadcrumb}
          />
        }
      />
    </div>
  );
}

export default function CategoryProductsPage({ params }: CategoryProductsPageProps) {
  const { slug } = use(params);

  return (
    <Suspense fallback={<PageSkeleton />}>
      <CategoryProductsContent slug={slug} />
    </Suspense>
  );
}
