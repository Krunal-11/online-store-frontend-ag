'use client';

import Link from 'next/link';
import { Package, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductEmptyStateProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showSearchSuggestion?: boolean;
}

export function ProductEmptyState({
  title = 'No products found',
  message = 'There are no products available at the moment. Please check back later or browse other categories.',
  showHomeButton = true,
  showSearchSuggestion = false,
}: ProductEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        {showSearchSuggestion ? (
          <Search className="h-12 w-12 text-gray-400" />
        ) : (
          <Package className="h-12 w-12 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-gray-500 text-center max-w-md mb-6">
        {message}
      </p>

      {showHomeButton && (
        <Button asChild variant="default">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      )}
    </div>
  );
}

export default ProductEmptyState;
