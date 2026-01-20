# STEP 7: PRODUCT GRID COMPONENT - DETAILED BREAKDOWN

**Date Completed**: January 20, 2026  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [Container/Presentational Architecture](#containerpresentational-architecture)
3. [Component Extraction and Reorganization](#component-extraction-and-reorganization)
4. [Server-Side Sorting vs Client-Side](#server-side-sorting-vs-client-side)
5. [URL-Based State Management](#url-based-state-management)
6. [Sticky Controls Pattern](#sticky-controls-pattern)
7. [Composable Component Design with Header Prop](#composable-component-design-with-header-prop)
8. [Type Re-exports and Barrel Files](#type-re-exports-and-barrel-files)
9. [Conditional Feature Rendering](#conditional-feature-rendering)

---

## Overview

Step 7 introduced a reusable `ProductGrid` component that encapsulates product listing, sorting, filtering, and infinite scroll. This component follows the Container/Presentational pattern and can be reused across category pages, search results, brand pages, and wishlist.

**What was accomplished:**
- ✅ Created reusable `ProductGrid` component with sort/filter controls
- ✅ Moved `ProductCard` from `home/` to `products/` folder
- ✅ Added sorting support to Products API (6 sort options)
- ✅ Implemented brand filter dropdown
- ✅ URL-based state for shareable/bookmarkable filters
- ✅ Sticky controls bar that stays visible while scrolling
- ✅ Created `useBrands` hook for brand data fetching

**Files Created:**
```
store/src/
├── components/products/
│   ├── ProductCard.tsx        # Moved from home/
│   ├── ProductGrid.tsx        # Main reusable grid component
│   ├── ProductGridControls.tsx # Sort/filter bar
│   ├── ProductGridSkeleton.tsx # Loading skeleton
│   ├── ProductEmptyState.tsx   # Empty state component
│   └── index.ts               # Barrel exports
└── hooks/
    └── useBrands.ts           # Hook for fetching brands
```

**Files Modified:**
```
store/src/
├── app/api/products/route.ts    # Added sorting logic
├── app/category/[slug]/products/page.tsx  # Now uses ProductGrid
├── components/home/
│   ├── index.ts                 # Re-exports ProductCard
│   └── FeaturedProducts.tsx     # Updated import path
└── hooks/
    ├── index.ts                 # New exports
    └── useInfiniteProducts.ts   # Added sort parameter
```

---

## Container/Presentational Architecture

### The Pattern

This step introduced a clear separation between **where data comes from** (pages/containers) and **how data is displayed** (shared components).

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAGE LAYER (Containers)                       │
│        Handles: routing, URL params, data fetching, SEO         │
├────────────────────┬────────────────────┬───────────────────────┤
│  /category/[slug]/ │     /search/       │   /brand/[slug]/      │
│  products/page.tsx │     page.tsx       │   page.tsx (future)   │
│                    │                    │                       │
│  - Reads slug      │  - Reads ?q=...    │  - Reads brand slug   │
│  - Gets categoryId │  - Gets search     │  - Gets brandId       │
│  - Renders header  │    query           │  - Renders brand info │
└────────┬───────────┴────────┬───────────┴───────────┬───────────┘
         │                    │                       │
         │  categoryId        │  search               │  brandId
         ▼                    ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      <ProductGrid />                             │
│                                                                  │
│  - Fetches products with useInfiniteProducts                    │
│  - Manages sort/filter state via URL                            │
│  - Renders controls, grid, loading, empty states                │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Matters

| Concern | Page (Container) | ProductGrid (Presentational) |
|---------|------------------|------------------------------|
| Routing/URL structure | ✅ Handles | ❌ Unaware |
| Data source params | ✅ Passes categoryId/search/brandId | ❌ Receives via props |
| SEO/Page title | ✅ Renders | ❌ Doesn't know |
| Grid layout | ❌ Delegates | ✅ Handles |
| Sort/filter UI | ❌ Delegates | ✅ Handles |
| Empty state | ❌ Configures message | ✅ Renders UI |

**Benefits:**
- **DRY**: Grid layout written once, used everywhere
- **Testable**: ProductGrid can be tested with mock data
- **Future-proof**: Adding `/wishlist` or `/sale` pages just needs a new container

---

## Component Extraction and Reorganization

### Folder Structure Change

```
BEFORE (Step 6):
components/
├── home/
│   ├── ProductCard.tsx      ← Lived here
│   ├── FeaturedProducts.tsx
│   └── CategoryGrid.tsx
└── common/
    └── Breadcrumb.tsx

AFTER (Step 7):
components/
├── home/
│   ├── FeaturedProducts.tsx  ← Now imports from products/
│   ├── CategoryGrid.tsx
│   └── index.ts              ← Re-exports ProductCard for compatibility
├── products/                  ← NEW FOLDER
│   ├── ProductCard.tsx       ← Moved here
│   ├── ProductGrid.tsx       ← NEW
│   ├── ProductGridControls.tsx ← NEW
│   ├── ProductGridSkeleton.tsx ← NEW
│   ├── ProductEmptyState.tsx   ← NEW
│   └── index.ts
└── common/
    └── Breadcrumb.tsx
```

### Backward Compatibility via Re-exports

To avoid breaking existing imports, the `home/index.ts` re-exports from the new location:

```tsx
// components/home/index.ts
export { HeroBanner } from './HeroBanner';
export { CategoryGrid } from './CategoryGrid';
export { FeaturedProducts } from './FeaturedProducts';
export { StoreInfo } from './StoreInfo';

// Re-export ProductCard from products folder for backward compatibility
export { ProductCard, ProductCardSkeleton } from '@/components/products';
```

**Result**: Existing code like `import { ProductCard } from '@/components/home'` continues to work.

---

## Server-Side Sorting vs Client-Side

### The Decision

With infinite scroll pagination, filtering/sorting **must** happen server-side.

### Why Not Client-Side?

```
Scenario: User is viewing category with 500 products

Client-Side Filtering:
1. User scrolls, loads 60 products (pages 1-2)
2. User filters by "Brand: Prestige"
3. Filter applied to 60 loaded products → Shows 8 matches
4. PROBLEM: 492 products not yet loaded might have Prestige products!

Server-Side Filtering:
1. User scrolls, loads 60 products
2. User filters by "Brand: Prestige"
3. API call: /products?brand=prestige&page=1
4. Server returns first 30 Prestige products
5. Infinite scroll loads more Prestige products
6. CORRECT: All matching products available via pagination
```

### Implementation

**API Route** (`app/api/products/route.ts`):

```tsx
// Sort options type
type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'discount' | 'newest';

const sortProducts = (items: ProductListItem[], sortBy: SortOption): ProductListItem[] => {
  const sorted = [...items];
  
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
    case 'price_desc':
      return sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);
    case 'rating':
      return sorted.sort((a, b) => b.averageRating - a.averageRating);
    case 'discount':
      return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
    case 'relevance':
    default:
      // Featured first, then by rating
      return sorted.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.averageRating - a.averageRating;
      });
  }
};
```

**Key Point**: Sorting happens **before** pagination, so the order is consistent across pages.

---

## URL-Based State Management

### The Pattern

Sort and filter state is stored in URL query parameters, not React state.

```
/category/mixer-grinder/products                    → Default (relevance, no filter)
/category/mixer-grinder/products?sort=price_asc     → Sorted by price
/category/mixer-grinder/products?brand=prestige     → Filtered by brand
/category/mixer-grinder/products?sort=rating&brand=bajaj → Both applied
```

### Implementation

```tsx
// ProductGrid.tsx
export function ProductGrid({ categoryId, brandId: propBrandId, ... }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Read state FROM URL
  const sort = (searchParams.get('sort') as SortOption) || 'relevance';
  const urlBrandId = searchParams.get('brand') || undefined;
  
  // Update URL when user changes filters
  const updateUrlParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleSortChange = (newSort: SortOption) => {
    updateUrlParams({ sort: newSort === 'relevance' ? undefined : newSort });
  };
}
```

### Benefits

| Feature | React State | URL State ✅ |
|---------|-------------|--------------|
| Shareable links | ❌ | ✅ Copy URL = same view |
| Bookmarkable | ❌ | ✅ Browser bookmark works |
| Back button | ❌ Loses state | ✅ Previous filters restored |
| Refresh page | ❌ Loses state | ✅ Filters preserved |
| SEO | ❌ | ✅ Search engines can index filtered pages |

### The `scroll: false` Option

```tsx
router.push(url, { scroll: false });
```

Without this, Next.js would scroll to top on every filter change. With `scroll: false`, the page stays in position while products refresh.

---

## Sticky Controls Pattern

### Implementation

```tsx
// ProductGridControls.tsx
<div
  className={cn(
    'sticky top-[64px] z-20',           // Stick below header (64px tall)
    'bg-white/95 backdrop-blur-sm',     // Semi-transparent background
    'border-b border-gray-200',         // Bottom border
    '-mx-4 px-4 py-3 mb-4'              // Negative margin to span full width
  )}
>
```

### Visual Behavior

```
┌─────────────────────────────────────────────┐
│ Header (fixed, z-30)                    64px │
├─────────────────────────────────────────────┤
│ Breadcrumb + Title                          │
├─────────────────────────────────────────────┤
│ Controls (sticky, z-20)          top: 64px  │ ← Sticks here on scroll
│ [24 products] [Brand ▼] [Sort ▼]            │
├─────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐            │
│ │     │ │     │ │     │ │     │            │
│ │     │ │     │ │     │ │     │            │
│ └─────┘ └─────┘ └─────┘ └─────┘            │
│                                             │
│ (scrollable content)                        │
└─────────────────────────────────────────────┘
```

### The Negative Margin Trick

```tsx
className="-mx-4 px-4"
```

This makes the controls bar span edge-to-edge while the parent container has padding. The negative margin pulls it out, then padding adds it back for content alignment.

---

## Composable Component Design with Header Prop

### The Pattern

Instead of hardcoding the header inside `ProductGrid`, we accept it as a prop:

```tsx
interface ProductGridProps {
  categoryId?: string;
  brandId?: string;
  search?: string;
  header?: React.ReactNode;  // ← Accepts any React content
  // ...
}
```

### Usage

```tsx
// Category page
<ProductGrid
  categoryId={category.id}
  header={
    <>
      <Breadcrumb items={breadcrumb} />
      <h1>{category.name}</h1>
    </>
  }
/>

// Search page (future)
<ProductGrid
  search={query}
  header={
    <>
      <h1>Search results for "{query}"</h1>
      <p>Found {totalItems} products</p>
    </>
  }
/>

// Brand page (future)
<ProductGrid
  brandId={brand.id}
  header={
    <>
      <img src={brand.logo} alt={brand.name} />
      <h1>{brand.name} Products</h1>
    </>
  }
/>
```

### Why This Pattern?

- **Flexibility**: Each page can render completely different headers
- **Type Safety**: `React.ReactNode` accepts any valid JSX
- **Composition**: Header is part of the component tree, not a separate render
- **Simplicity**: No need for complex render props or slot systems

---

## Type Re-exports and Barrel Files

### Exporting Types from Hooks

```tsx
// hooks/useInfiniteProducts.ts
export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'discount' | 'newest';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  // ...
];
```

```tsx
// hooks/index.ts
export { useInfiniteProducts, SORT_OPTIONS } from './useInfiniteProducts';
export type { SortOption } from './useInfiniteProducts';
```

### Usage

```tsx
import { SORT_OPTIONS } from '@/hooks';
import type { SortOption } from '@/hooks';

// Use type for props
interface Props {
  sort: SortOption;
}

// Use constant for rendering
{SORT_OPTIONS.map((option) => (
  <SelectItem key={option.value} value={option.value}>
    {option.label}
  </SelectItem>
))}
```

### Why Separate `type` Export?

TypeScript's `isolatedModules` mode (used by Next.js) requires explicit type exports. The `export type { }` syntax ensures the type is erased at runtime while being available for type checking.

---

## Conditional Feature Rendering

### Brand Filter Logic

The brand filter should only show when it makes sense:

```tsx
// ProductGrid.tsx
// Don't show if brandId was passed as prop (already filtering by brand)
const shouldShowBrandFilter = showBrandFilter && !propBrandId;
```

### Scenario Table

| Page | `brandId` prop | `showBrandFilter` | Result |
|------|----------------|-------------------|--------|
| Category page | undefined | true | ✅ Show brand filter |
| Search page | undefined | true | ✅ Show brand filter |
| Brand page | "prestige" | true | ❌ Hide (already filtered) |
| Wishlist | undefined | false | ❌ Hide (explicitly disabled) |

### Clear Filters Button

Only shown when filters are active:

```tsx
const hasActiveFilters = useMemo(() => {
  return sort !== 'relevance' || !!urlBrandId;
}, [sort, urlBrandId]);

// In JSX
{hasActiveFilters && onClearFilters && (
  <Button onClick={onClearFilters}>
    <X className="h-3 w-3 mr-1" />
    Clear filters
  </Button>
)}
```

---

## Key Takeaways

1. **Container/Presentational Split**: Pages handle routing and data source; shared components handle rendering.

2. **Server-Side Filtering**: Essential for paginated data to work correctly.

3. **URL State**: Better UX than React state for filters/sort (shareable, bookmarkable, back button works).

4. **Composition via Props**: `header` prop allows flexible customization without complex patterns.

5. **Backward Compatibility**: Re-exports maintain existing imports when reorganizing code.

6. **Sticky Elements**: Use `sticky` with explicit `top` offset and appropriate `z-index` layering.
