import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-16 h-16 text-gray-300" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the product you&apos;re looking for. It may have been 
          removed, renamed, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/#categories">
              Browse Categories
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
