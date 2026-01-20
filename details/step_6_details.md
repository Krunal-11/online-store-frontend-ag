# STEP 6: CATEGORY NAVIGATION AND PAGES - DETAILED BREAKDOWN

**Date Completed**: January 20, 2026  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Multi-Level State Management](#multi-level-state-management)
4. [Nested Category Drill-Down Pattern](#nested-category-drill-down-pattern)
5. [Intersection Observer for Infinite Scroll](#intersection-observer-for-infinite-scroll)
6. [SWR Infinite for Pagination](#swr-infinite-for-pagination)
7. [Breadcrumb Navigation Pattern](#breadcrumb-navigation-pattern)
8. [Environment Variables in Next.js](#environment-variables-in-nextjs)
9. [Conditional Data Fetching with SWR](#conditional-data-fetching-with-swr)
10. [Selected State Styling Pattern](#selected-state-styling-pattern)
11. [Dynamic Route Parameters in App Router](#dynamic-route-parameters-in-app-router)
12. [Empty State Design Pattern](#empty-state-design-pattern)
13. [Common Patterns](#common-patterns)

---

## Overview

Step 6 implemented category navigation with a nested drill-down UI on the homepage and a separate product listing page with infinite scroll.

**What was accomplished:**
- ✅ Nested category drill-down on homepage (main categories always visible)
- ✅ Two-level state tracking for category expansion
- ✅ Selected state indicator with teal border + light background
- ✅ Breadcrumb component for navigation trail
- ✅ Infinite scroll product listing with Intersection Observer
- ✅ Empty state handling for categories without products
- ✅ Environment variable for pagination configuration

**Files Created:**
```
store/src/
├── components/common/
│   └── Breadcrumb.tsx       # Reusable breadcrumb navigation
├── hooks/
│   └── useInfiniteProducts.ts  # Infinite scroll pagination hook
└── app/category/[slug]/products/
    └── page.tsx             # Category products listing page
```

**Files Modified:**
```
store/
├── .env.local               # Added NEXT_PUBLIC_PRODUCTS_PER_PAGE
└── src/
    ├── components/home/
    │   └── CategoryGrid.tsx # Complete refactor for nested behavior
    └── hooks/
        └── useCategories.ts # Added subcategories + breadcrumb to useCategory
```

---

## Component Architecture

### Category Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOMEPAGE                                 │
├─────────────────────────────────────────────────────────────────┤
│  Browse by Category                                              │
│  ┌────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌────────┐       │
│  │Kitchen │ │Electr- │ │Bathroom │ │Storage │ │Cleaning│       │
│  │Appli-  │ │onics   │ │Essen-   │ │& Org-  │ │Supplies│       │
│  │ances ▼ │ │   ▼    │ │tials    │ │aniz..  │ │        │       │
│  └────────┘ └────────┘ └─────────┘ └────────┘ └────────┘       │
│  [Selected]                                                      │
│  ─────────────────────────────────────────────────────          │
│  Kitchen Appliances              [View All Products →]          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                   │
│  │Mixers &│ │Cooking │ │Refrig- │ │Small   │  ← Level 1        │
│  │Grinders│ │Appli-  │ │eration │ │Appli-  │    Subcategories  │
│  │   ▼    │ │ances   │ │        │ │ances   │                   │
│  └────────┘ └────────┘ └────────┘ └────────┘                   │
│  [Selected]                                                      │
│  ─────────────────────────────────────────────────────          │
│  Mixers & Grinders               [View All Products →]          │
│  ┌────────┐ ┌────────┐ ┌────────┐                              │
│  │ Mixer  │ │ Wet    │ │ Hand   │  ← Level 2                   │
│  │Grinder │ │Grinders│ │Blenders│    Subcategories              │
│  └────────┘ └────────┘ └────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Click category without children
                              │ OR click "View All Products"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  /category/mixers-grinders/products                              │
├─────────────────────────────────────────────────────────────────┤
│  Home > Kitchen Appliances > Mixers & Grinders                  │
│                                                                  │
│  Mixers & Grinders                                              │
│  24 products found                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Product │ │ Product │ │ Product │ │ Product │               │
│  │  Card   │ │  Card   │ │  Card   │ │  Card   │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Product │ │ Product │ │ Product │ │ Product │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                    ↓ (Infinite Scroll)                          │
│              Loading more products...                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Multi-Level State Management

### The Problem

Traditional drill-down replaces the current view with subcategories. Our requirement was to keep main categories visible and show subcategories *below* in a nested fashion.

### Solution: Two-Level State Tracking

```tsx
// CategoryGrid.tsx
export function CategoryGrid() {
  // Track which category is expanded at each level
  const [expandedLevel0, setExpandedLevel0] = useState<string | null>(null);
  const [expandedLevel1, setExpandedLevel1] = useState<string | null>(null);
  
  // Fetch subcategories only when a level is expanded
  const { subcategories: level1Categories } = useCategory(expandedLevel0 || undefined);
  const { subcategories: level2Categories } = useCategory(expandedLevel1 || undefined);
```

### State Flow Diagram

```
Initial State:
  expandedLevel0 = null
  expandedLevel1 = null
  → Only Level 0 (main categories) visible

Click "Kitchen Appliances":
  expandedLevel0 = "kitchen-appliances"
  expandedLevel1 = null
  → Level 0 visible + Level 1 subcategories appear below

Click "Mixers & Grinders" (in Level 1):
  expandedLevel0 = "kitchen-appliances"
  expandedLevel1 = "mixers-grinders"
  → Level 0 + Level 1 + Level 2 all visible

Click "Kitchen Appliances" again:
  expandedLevel0 = null  (collapsed)
  expandedLevel1 = null  (reset)
  → Back to only Level 0 visible
```

### Toggle vs Switch Logic

```tsx
const handleLevel0Click = (category: Category) => {
  if (expandedLevel0 === category.slug) {
    // Same category clicked → COLLAPSE
    setExpandedLevel0(null);
    setExpandedLevel1(null);  // Also reset Level 1
  } else {
    // Different category → SWITCH to new category
    setExpandedLevel0(category.slug);
    setExpandedLevel1(null);  // Reset Level 1 when switching
  }
};
```

**Key Insight**: When switching Level 0 categories, we must reset Level 1 state. Otherwise, old Level 1 subcategories would remain selected for the new parent.

---

## Nested Category Drill-Down Pattern

### Component Structure

```tsx
// Main grid (always visible)
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

{/* Level 1 Subcategories - Conditional rendering */}
{expandedLevel0 && level1Categories.length > 0 && (
  <SubcategorySection
    parentCategory={expandedLevel0Category}
    subcategories={level1Categories}
    selectedSubcategorySlug={expandedLevel1}
    onSelectSubcategory={handleLevel1Click}
    level={1}
  />
)}

{/* Level 2 Subcategories - Conditional rendering */}
{expandedLevel1 && level2Categories.length > 0 && (
  <SubcategorySection
    parentCategory={level1Category}
    subcategories={level2Categories}
    selectedSubcategorySlug={null}  // Level 2 never expands further
    onSelectSubcategory={handleLevel2Click}
    level={2}
  />
)}
```

### SubcategorySection Component

Each subcategory level is wrapped in a consistent section component:

```tsx
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
      level === 1 && 'ml-0 sm:ml-4',   // Slight indent on desktop
      level === 2 && 'ml-0 sm:ml-8'    // More indent for deeper level
    )}>
      {/* Section Header with "View All Products" button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {parentCategory.name}
        </h3>
        <Link href={`/category/${parentCategory.slug}/products`}>
          View All Products →
        </Link>
      </div>

      {/* Grid of subcategory cards */}
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
```

**Key Features:**
- Border separator between levels (`border-t`)
- Progressive indentation on desktop (`ml-4`, `ml-8`)
- "View All Products" button for each level
- Reusable for both Level 1 and Level 2

---

## Intersection Observer for Infinite Scroll

### What is Intersection Observer?

The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or the viewport.

### Why Use It for Infinite Scroll?

- **Performance**: No scroll event listeners (which fire frequently)
- **Battery**: Less CPU usage on mobile devices
- **Clean API**: Callback-based, easy to integrate

### Implementation Pattern

```tsx
// useInfiniteProducts.ts
export function useInfiniteProducts(params?: UseInfiniteProductsParams) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [loadMoreRef, setLoadMoreRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // When sentinel element becomes visible, load more
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        rootMargin: '200px',  // Start loading 200px before visible
      }
    );

    observerRef.current.observe(loadMoreRef);

    // Cleanup on unmount
    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMoreRef, hasMore, isLoadingMore, loadMore]);

  return {
    setLoadMoreRef,  // Callback ref for the sentinel element
    // ... other values
  };
}
```

### Using the Hook in a Component

```tsx
// In the products page
const { products, hasMore, isLoadingMore, setLoadMoreRef } = useInfiniteProducts();

return (
  <>
    <div className="grid grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>

    {/* Sentinel Element - Observer watches this */}
    {hasMore && (
      <div ref={setLoadMoreRef}>
        {isLoadingMore && <LoadingSpinner />}
      </div>
    )}
  </>
);
```

### Key Concepts

| Concept | Explanation |
|---------|-------------|
| `rootMargin` | Expands/contracts the root's bounding box. `'200px'` means trigger 200px before element is visible. |
| Sentinel Element | An invisible element at the bottom of the list that triggers loading. |
| Callback Ref | Using `setLoadMoreRef` instead of `useRef` allows us to observe when the ref changes. |
| Cleanup | Always disconnect observer on unmount to prevent memory leaks. |

---

## SWR Infinite for Pagination

### What is SWR Infinite?

`useSWRInfinite` is a special hook from SWR for handling paginated/infinite data. It manages multiple "pages" of data and provides utilities for loading more.

### Key Function: getKey

The `getKey` function determines the API URL for each page:

```tsx
const getKey = (
  pageIndex: number,
  previousPageData: PaginatedResponse<ProductListItem> | null
) => {
  // Stop fetching if no more pages
  if (previousPageData && !previousPageData.pagination?.hasNextPage) {
    return null;  // Returning null stops the pagination
  }

  // Build URL for this page
  const searchParams = new URLSearchParams();
  searchParams.set('page', (pageIndex + 1).toString());  // 1-indexed pages
  searchParams.set('limit', PRODUCTS_PER_PAGE.toString());
  
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId);

  return `/products?${searchParams.toString()}`;
};
```

**Key Points:**
- `pageIndex` is 0-indexed, but API often uses 1-indexed pages
- Return `null` to stop fetching more pages
- `previousPageData` contains the response from the previous page

### Flattening Pages into a Single Array

SWR Infinite returns an array of pages. We flatten it:

```tsx
const { data, size, setSize } = useSWRInfinite<PaginatedResponse<ProductListItem>>(
  getKey, 
  fetcher
);

// data = [Page1Response, Page2Response, Page3Response, ...]
// Each page has: { data: [...products], pagination: {...} }

// Flatten into single array
const products = data ? data.flatMap((page) => page.data) : [];
// products = [...page1Products, ...page2Products, ...page3Products]
```

### Loading More

```tsx
const loadMore = useCallback(() => {
  if (!isLoadingMore && hasMore) {
    setSize((prev) => prev + 1);  // Request next page
  }
}, [isLoadingMore, hasMore, setSize]);
```

`setSize(prev => prev + 1)` tells SWR to fetch the next page.

### Returned Values

```tsx
return {
  products,        // Flattened array of all products
  isLoading,       // Initial loading
  isLoadingMore,   // Loading additional pages
  hasMore,         // More pages available?
  totalItems,      // Total count from first page
  loadMore,        // Function to trigger next page
  setLoadMoreRef,  // Ref for intersection observer
};
```

---

## Breadcrumb Navigation Pattern

### Component Structure

```tsx
// Breadcrumb.tsx
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
              {/* Separator (not on first item) */}
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              )}
              
              {/* Link or plain text for last item */}
              {isLast ? (
                <span className="text-gray-900 font-medium">{item.name}</span>
              ) : (
                <Link href={href} className="text-gray-500 hover:text-primary">
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
```

### Accessibility Features

| Feature | Implementation |
|---------|---------------|
| Semantic HTML | Uses `<nav>` and `<ol>` elements |
| ARIA Label | `aria-label="Breadcrumb"` for screen readers |
| Last Item Not Linked | Current page shown as text, not link |

### Building Breadcrumbs on the Backend

```tsx
// In API route: /api/categories/[slug]/route.ts
const buildBreadcrumb = (category: Category): BreadcrumbItem[] => {
  const breadcrumb: BreadcrumbItem[] = [{ name: 'Home', slug: '/' }];
  
  if (category.path) {
    // path = "kitchen-appliances/mixers-grinders"
    const pathParts = category.path.split('/').filter(Boolean);
    let currentPath = '';
    
    for (const part of pathParts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const cat = findCategoryByPath(currentPath);
      if (cat) {
        breadcrumb.push({ name: cat.name, slug: cat.slug });
      }
    }
  }
  
  return breadcrumb;
};
```

**Result:** `[Home, Kitchen Appliances, Mixers & Grinders]`

---

## Environment Variables in Next.js

### Client-Side Environment Variables

Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser:

```env
# .env.local
NEXT_PUBLIC_PRODUCTS_PER_PAGE=30
```

### Reading Environment Variables

```tsx
// useInfiniteProducts.ts
const PRODUCTS_PER_PAGE = parseInt(
  process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE || '30',
  10
);
```

**Key Points:**
- Always provide a fallback value (`|| '30'`)
- Parse to number with `parseInt(value, 10)`
- The `10` is the radix (base 10)

### Why Use Environment Variables for Pagination?

1. **Easy Configuration**: Change pagination without code changes
2. **Environment-Specific**: Different values for dev vs production
3. **No Rebuild Required**: Just restart the server

### Naming Convention

| Prefix | Access |
|--------|--------|
| `NEXT_PUBLIC_` | Available in browser AND server |
| (none) | Server-only (API routes, Server Components) |

---

## Conditional Data Fetching with SWR

### The Pattern

Pass `null` to SWR to skip fetching:

```tsx
export function useCategory(slugOrId: string | undefined) {
  const { data } = useSWR<CategoryDetailResponse>(
    slugOrId ? `/categories/${slugOrId}` : null,  // null = don't fetch
    fetcher
  );
  // ...
}
```

### When This is Useful

```tsx
// In CategoryGrid
const [expandedLevel0, setExpandedLevel0] = useState<string | null>(null);

// Only fetches when a category is expanded
const { subcategories } = useCategory(expandedLevel0 || undefined);
```

**Behavior:**
- `expandedLevel0 = null` → SWR key is `null` → No fetch
- `expandedLevel0 = "kitchen"` → SWR key is `/categories/kitchen` → Fetches data

### Benefits

- **Avoids Unnecessary Requests**: Don't fetch until needed
- **Automatic Cleanup**: SWR handles cache invalidation
- **Declarative**: Fetching is driven by state, not imperative calls

---

## Selected State Styling Pattern

### Design Decision: Option E

Selected categories use teal border + light teal background:

```tsx
// CategoryCard.tsx
<button
  className={cn(
    'group flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200',
    isSelected
      ? 'bg-primary/10 ring-2 ring-primary'   // Selected state
      : 'hover:bg-gray-50'                     // Default hover
  )}
>
```

### Visual Breakdown

| State | Classes | Visual |
|-------|---------|--------|
| Default | `hover:bg-gray-50` | Light gray on hover |
| Selected | `bg-primary/10` | Light teal background (10% opacity) |
| Selected | `ring-2 ring-primary` | 2px teal border |

### Chevron Rotation for Expand Indicator

```tsx
{category.children && category.children.length > 0 && (
  <ChevronDown className={cn(
    'h-4 w-4 transition-transform duration-200',
    isSelected ? 'text-primary rotate-180' : 'text-gray-400'
  )} />
)}
```

**Behavior:**
- Default: `▼` pointing down
- Expanded: `▲` rotated 180° to point up

### Using `cn()` for Conditional Classes

The `cn()` function (from `lib/utils.ts`) merges class names intelligently:

```tsx
import { cn } from '@/lib/utils';

// Combines base classes with conditional classes
className={cn(
  'base-classes here',
  condition && 'conditional-class',
  anotherCondition ? 'if-true' : 'if-false'
)}
```

---

## Dynamic Route Parameters in App Router

### Route Definition

```
app/category/[slug]/products/page.tsx
```

The `[slug]` folder creates a dynamic segment.

### Accessing Parameters

In Next.js 15, `params` is a Promise:

```tsx
interface CategoryProductsPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryProductsPage({ params }: CategoryProductsPageProps) {
  const { slug } = use(params);  // React's use() hook unwraps the Promise
  
  // Now use slug to fetch data
  const { category } = useCategory(slug);
}
```

### Why `use()` Instead of `await`?

- `await` requires `async` component (Server Component)
- `use()` works in Client Components (`'use client'`)
- Both handle the Promise, but `use()` integrates with React's Suspense

### URL Examples

| URL | `slug` value |
|-----|--------------|
| `/category/kitchen/products` | `"kitchen"` |
| `/category/mixers-grinders/products` | `"mixers-grinders"` |

---

## Empty State Design Pattern

### When to Show Empty State

```tsx
{products.length === 0 && !isProductsLoading ? (
  <EmptyState categoryName={category.name} />
) : (
  <ProductsGrid products={products} />
)}
```

**Conditions:**
- No products exist (`products.length === 0`)
- NOT currently loading (`!isProductsLoading`)

### Empty State Component

```tsx
function EmptyState({ categoryName }: { categoryName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <Package className="h-12 w-12 text-gray-400" />
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No products available
      </h3>
      
      {/* Description */}
      <p className="text-gray-500 text-center max-w-md">
        There are no products in &quot;{categoryName}&quot; at the moment.
      </p>
      
      {/* Call to Action */}
      <Link href="/" className="mt-6 inline-flex items-center gap-2 ...">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
```

### Empty State Anatomy

| Element | Purpose |
|---------|---------|
| Icon | Visual indicator that something is empty |
| Title | Clear, short explanation |
| Description | Additional context, reassurance |
| CTA | Guide user to next action |

---

## Common Patterns

### 1. Callback Ref Pattern

When you need to observe when an element mounts/unmounts:

```tsx
const [loadMoreRef, setLoadMoreRef] = useState<HTMLDivElement | null>(null);

// setLoadMoreRef is used as a ref callback
<div ref={setLoadMoreRef}>...</div>
```

Using `useState` instead of `useRef` lets you trigger effects when the ref changes.

### 2. Loading State Hierarchy

```tsx
// Initial loading
if (isLoading && products.length === 0) {
  return <FullPageSkeleton />;
}

// Loading more (but have some data)
{isLoadingMore && <LoadingMore />}
```

### 3. Type-Safe API Response

```tsx
// Define response shape
interface CategoryDetailResponse {
  data: Category;
  subcategories: Category[];
  breadcrumb: BreadcrumbItem[];
}

// Use in SWR
const { data } = useSWR<CategoryDetailResponse>(url, fetcher);
```

### 4. Responsive Indentation

```tsx
className={cn(
  'mt-6 pt-6 border-t border-gray-200',
  level === 1 && 'ml-0 sm:ml-4',   // No indent on mobile
  level === 2 && 'ml-0 sm:ml-8'    // Larger indent, still mobile-friendly
)}
```

### 5. Flattening Nested Data

```tsx
// Flatten array of pages into single array
const products = data ? data.flatMap((page) => page.data) : [];
```

`flatMap` = `map` + `flat(1)` combined.

### 6. Category Has Children Check

```tsx
const hasChildren = category.children && category.children.length > 0;

if (hasChildren) {
  // Expand to show subcategories
} else {
  // Navigate to products page
}
```

---

## Key Takeaways

1. **Multi-Level State**: Track expanded state for each nesting level separately. Reset child state when parent changes.

2. **Intersection Observer**: Superior to scroll events for infinite scroll - better performance, cleaner API.

3. **SWR Infinite**: Use `getKey` function to control pagination. Return `null` to stop fetching.

4. **Conditional Fetching**: Pass `null` to SWR to skip requests until data is needed.

5. **Breadcrumbs**: Build on backend from category path. Keep last item as non-clickable text.

6. **Environment Variables**: Use `NEXT_PUBLIC_` prefix for browser-accessible config.

7. **Selected State**: Combine background color + ring/border for clear visual feedback.

8. **Empty States**: Always handle the zero-data case with helpful messaging and CTAs.

9. **App Router Params**: Use React's `use()` hook to unwrap Promise params in Client Components.

10. **Progressive Enhancement**: Start mobile-first (no indent), add desktop features (`sm:ml-4`).

---

*Last Updated: January 20, 2026*
