'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  name: string;
  slug: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-sm', className)}>
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const href = item.slug === '/' ? '/' : `/category/${item.slug}/products`;

          return (
            <li key={item.slug} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1 flex-shrink-0" />
              )}
              {isLast ? (
                <span className="text-gray-900 font-medium">{item.name}</span>
              ) : item.slug === '/' ? (
                <Link
                  href="/"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <Link
                  href={href}
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
