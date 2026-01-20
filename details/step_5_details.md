# STEP 5: HOMEPAGE IMPLEMENTATION - DETAILED BREAKDOWN

**Date Completed**: January 14, 2026  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Carousel Implementation with Embla](#carousel-implementation-with-embla)
4. [Autoplay Plugin Integration](#autoplay-plugin-integration)
5. [Responsive Image Handling](#responsive-image-handling)
6. [Skeleton Loaders Pattern](#skeleton-loaders-pattern)
7. [Product Card Component](#product-card-component)
8. [Currency Formatting in JavaScript](#currency-formatting-in-javascript)
9. [Responsive Grid Systems](#responsive-grid-systems)
10. [Custom Hooks for Data Fetching](#custom-hooks-for-data-fetching)
11. [Client vs Server Components](#client-vs-server-components)
12. [Common Patterns](#common-patterns)

---

## Overview

Step 5 built the homepage - the main entry point for users. It showcases banners, categories, and featured products using reusable components that will be used throughout the application.

**What was accomplished:**
- ✅ Hero banner carousel with autoplay
- ✅ Category grid with responsive columns
- ✅ Featured products section
- ✅ Reusable ProductCard component
- ✅ Skeleton loaders for loading states
- ✅ Store information section

**Files Created:**
```
store/src/
├── components/home/
│   ├── HeroBanner.tsx       # Banner carousel with autoplay
│   ├── CategoryGrid.tsx     # Category cards grid
│   ├── ProductCard.tsx      # Reusable product tile
│   ├── FeaturedProducts.tsx # Featured products section
│   ├── StoreInfo.tsx        # Store contact info
│   └── index.ts             # Barrel exports
└── hooks/
    ├── useBanners.ts        # Fetch banners
    └── useFeaturedProducts.ts # Fetch featured products
```

---

## Component Architecture

### Homepage Structure

The homepage is composed of multiple sections, each as a separate component:

```
┌─────────────────────────────────────────────────────┐
│                   HEADER (from Step 3)               │
├─────────────────────────────────────────────────────┤
│                                                      │
│   ┌─────────────────────────────────────────────┐   │
│   │           HERO BANNER CAROUSEL               │   │
│   │        (auto-rotating, clickable)            │   │
│   └─────────────────────────────────────────────┘   │
│                                                      │
│   Browse by Category                                 │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│   │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │        │
│   │Name│ │Name│ │Name│ │Name│ │Name│ │Name│        │
│   └────┘ └────┘ └────┘ └────┘ └────┘ └────┘        │
│                                                      │
│   Featured Products                                  │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│   │  Image  │ │  Image  │ │  Image  │ │  Image  │   │
│   │ Brand   │ │ Brand   │ │ Brand   │ │ Brand   │   │
│   │ Title   │ │ Title   │ │ Title   │ │ Title   │   │
│   │ ₹price  │ │ ₹price  │ │ ₹price  │ │ ₹price  │   │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                      │
│   ┌─────────────────────────────────────────────┐   │
│   │              STORE INFO                      │   │
│   │     Phone | Address | Delivery Badge         │   │
│   └─────────────────────────────────────────────┘   │
│                                                      │
├─────────────────────────────────────────────────────┤
│                   FOOTER (from Step 3)               │
└─────────────────────────────────────────────────────┘
```

### Component Composition in page.tsx

The page component simply composes the sections together:

```tsx
// app/page.tsx
import { HeroBanner, CategoryGrid, FeaturedProducts, StoreInfo } from '@/components/home';

export default function Home() {
  return (
    <div className="container-main py-4 md:py-8">
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <StoreInfo />
    </div>
  );
}
```

**Key Insight**: The page file is minimal - it's just a layout of components. Each component handles its own:
- Data fetching
- Loading states
- Error handling
- Responsive design

---

## Carousel Implementation with Embla

### What is Embla Carousel?

Embla is a lightweight, framework-agnostic carousel library. shadcn/ui provides a React wrapper for it.

### Basic Carousel Structure

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

function SimpleCarousel() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
        <CarouselItem>Slide 3</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
```

### Carousel Options

Embla accepts options to customize behavior:

```tsx
<Carousel
  opts={{
    align: 'start',    // Alignment of slides
    loop: true,        // Infinite loop
    dragFree: false,   // Snap to slides
  }}
>
```

| Option | Description |
|--------|-------------|
| `align` | `'start'`, `'center'`, `'end'` - slide alignment |
| `loop` | `true` = infinite scroll, `false` = stops at ends |
| `dragFree` | `true` = free scrolling, `false` = snap to slides |
| `skipSnaps` | Allow skipping slides during fast swipe |

### Accessing the Carousel API

To programmatically control the carousel:

```tsx
function ControlledCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);

  // Listen for slide changes
  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect(); // Get initial value

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>...</CarouselContent>
    </Carousel>
  );
}
```

**Key Methods:**
```typescript
api.scrollPrev()        // Go to previous slide
api.scrollNext()        // Go to next slide
api.scrollTo(index)     // Go to specific slide
api.selectedScrollSnap() // Get current slide index
api.scrollSnapList()    // Get array of all snap points
api.canScrollPrev()     // Check if can go back
api.canScrollNext()     // Check if can go forward
```

---

## Autoplay Plugin Integration

### Installing the Plugin

```bash
npm install embla-carousel-autoplay
```

### Basic Autoplay Usage

```tsx
import Autoplay from 'embla-carousel-autoplay';

function AutoplayCarousel() {
  // Create plugin instance with useRef (persists across renders)
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <Carousel plugins={[autoplayPlugin.current]}>
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
```

### Autoplay Options

```typescript
Autoplay({
  delay: 5000,             // Time between slides (ms)
  stopOnInteraction: true, // Stop when user interacts
  stopOnMouseEnter: false, // Stop when mouse hovers
  playOnInit: true,        // Start automatically
})
```

### Why useRef for Plugins?

```tsx
// ❌ WRONG - Creates new instance every render
const plugin = Autoplay({ delay: 5000 });

// ✅ CORRECT - Same instance persists
const plugin = React.useRef(Autoplay({ delay: 5000 }));
```

Without `useRef`, a new plugin instance would be created on every render, breaking autoplay functionality.

---

## Responsive Image Handling

### The Problem

Different devices need different image sizes:
- Desktop: Wide banner (21:7 aspect ratio)
- Mobile: Taller banner (16:9 aspect ratio)

### Solution 1: Conditional Rendering (Our Approach)

```tsx
<CarouselItem>
  {/* Desktop Image - Hidden on mobile */}
  <div className="hidden md:block relative w-full aspect-[21/7]">
    <Image
      src={banner.imageUrlDesktop}
      alt={banner.title}
      fill
      className="object-cover"
    />
  </div>
  
  {/* Mobile Image - Hidden on desktop */}
  <div className="block md:hidden relative w-full aspect-[16/9]">
    <Image
      src={banner.imageUrlMobile}
      alt={banner.title}
      fill
      className="object-cover"
    />
  </div>
</CarouselItem>
```

**How it works:**
- `hidden md:block` = Hidden by default, visible from `md` breakpoint (768px)
- `block md:hidden` = Visible by default, hidden from `md` breakpoint

### Solution 2: HTML Picture Element (Alternative)

```tsx
<picture>
  <source 
    media="(min-width: 768px)" 
    srcSet={banner.imageUrlDesktop}
  />
  <img 
    src={banner.imageUrlMobile} 
    alt={banner.title}
  />
</picture>
```

### Next.js Image Component Properties

```tsx
<Image
  src="/banner.jpg"          // Image source
  alt="Description"          // Accessibility text
  fill                       // Fill parent container
  className="object-cover"   // CSS object-fit
  priority                   // Preload (above the fold)
  sizes="100vw"              // Responsive size hints
  unoptimized               // Skip Next.js optimization (for external URLs)
/>
```

| Property | Purpose |
|----------|---------|
| `fill` | Image fills parent container (use with relative parent) |
| `priority` | Preloads image - use for above-the-fold content |
| `sizes` | Helps browser choose correct image size |
| `unoptimized` | Required for external domains not in `next.config.ts` |

### Aspect Ratio with Tailwind

```css
aspect-[21/7]   /* 21:7 ratio (banner desktop) */
aspect-[16/9]   /* 16:9 ratio (video, mobile banner) */
aspect-square   /* 1:1 ratio */
aspect-video    /* 16:9 ratio (predefined) */
```

---

## Skeleton Loaders Pattern

### What are Skeleton Loaders?

Skeleton loaders show placeholder shapes where content will appear, giving users a preview of the layout while data loads.

```
Loading State:              Loaded State:
┌─────────────────┐         ┌─────────────────┐
│  ░░░░░░░░░░░░░  │         │   [Product Img] │
├─────────────────┤         ├─────────────────┤
│ ░░░░░░          │   →     │ PRESTIGE        │
│ ░░░░░░░░░░░     │         │ Mixer Grinder   │
│ ░░░░            │         │ ★ 4.5           │
│ ░░░░░░░         │         │ ₹3,499          │
└─────────────────┘         └─────────────────┘
```

### shadcn/ui Skeleton Component

```tsx
import { Skeleton } from '@/components/ui/skeleton';

// Just a div with animated background
<Skeleton className="h-4 w-20" />  // Small text placeholder
<Skeleton className="h-32 w-full" /> // Large image placeholder
```

The component is simple:
```tsx
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}
```

### Creating Component-Specific Skeletons

Match skeleton dimensions to actual content:

```tsx
// ProductCardSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-lg border overflow-hidden">
      {/* Image area */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Content area */}
      <div className="flex flex-col p-3 gap-2">
        <Skeleton className="h-3 w-16" />  {/* Brand */}
        <Skeleton className="h-4 w-full" /> {/* Title line 1 */}
        <Skeleton className="h-4 w-3/4" />  {/* Title line 2 */}
        <Skeleton className="h-3 w-12" />   {/* Rating */}
        <Skeleton className="h-5 w-20 mt-2" /> {/* Price */}
      </div>
    </div>
  );
}
```

### Using Skeletons with Data Fetching

```tsx
function FeaturedProducts() {
  const { products, isLoading } = useFeaturedProducts(8);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Creating Arrays for Skeletons

```tsx
// Create array of N elements
Array.from({ length: 8 })  // [undefined, undefined, ...]

// With index
Array.from({ length: 8 }).map((_, index) => (
  <Skeleton key={index} />
))

// Alternative syntax
[...Array(8)].map((_, i) => ...)
```

---

## Product Card Component

### Anatomy of a Product Card

```
┌───────────────────────────┐
│ [20% OFF]          [♡]   │ ← Discount badge + Wishlist button
├───────────────────────────┤
│                           │
│        PRODUCT IMAGE      │ ← Aspect square, object-contain
│                           │
├───────────────────────────┤
│ BRAND NAME                │ ← Uppercase, small, gray
│ Product Title Here        │ ← Medium weight, 2-line clamp
│ That Might Be Long        │
│ ★ 4.5 (128)              │ ← Rating with review count
│ ₹3,499  ₹4,999           │ ← Selling price + MRP strikethrough
└───────────────────────────┘
```

### Key Techniques Used

**1. Text Clamping (Truncation)**
```tsx
<h3 className="line-clamp-2">
  Very Long Product Title That Would Normally Wrap To Many Lines
</h3>
```
`line-clamp-2` limits text to 2 lines with ellipsis.

**2. Price Display**
```tsx
<div className="flex items-baseline gap-2">
  <span className="text-base font-semibold">₹3,499</span>
  <span className="text-sm text-gray-400 line-through">₹4,999</span>
</div>
```
- `items-baseline` aligns text baselines (not tops)
- `line-through` for strikethrough effect

**3. Conditional Rendering**
```tsx
{hasDiscount && (
  <Badge className="bg-amber-500">
    {product.discountPercentage}% OFF
  </Badge>
)}
```

**4. Wishlist Toggle**
```tsx
const handleWishlistToggle = async (e: React.MouseEvent) => {
  e.preventDefault();      // Prevent card link navigation
  e.stopPropagation();     // Stop event bubbling
  
  if (isInWishlist) {
    await removeFromWishlist(wishlistItem.id);
  } else {
    await addToWishlist(product.productGroupId, product.id);
  }
  refreshWishlist();       // Refetch wishlist data
};
```

**5. Hover Effects**
```tsx
<Image
  className="group-hover:scale-105 transition-transform duration-300"
/>
```
- `group` on parent, `group-hover:` on child
- Image scales up on card hover

---

## Currency Formatting in JavaScript

### The Intl.NumberFormat API

JavaScript's built-in internationalization API for formatting numbers:

```typescript
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

formatPrice(3499);  // "₹3,499"
formatPrice(12500); // "₹12,500"
```

### Options Explained

| Option | Purpose |
|--------|---------|
| `'en-IN'` | Locale - Indian English (uses lakhs, crores) |
| `style: 'currency'` | Format as currency (adds symbol) |
| `currency: 'INR'` | Indian Rupee |
| `minimumFractionDigits: 0` | No decimal places |

### Locale Differences

```typescript
// Indian format (lakhs, crores)
new Intl.NumberFormat('en-IN').format(1234567);
// "12,34,567"

// US format (thousands, millions)
new Intl.NumberFormat('en-US').format(1234567);
// "1,234,567"
```

### Common Currency Formats

```typescript
// Indian Rupee
new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
  .format(1000); // "₹1,000"

// US Dollar
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  .format(1000); // "$1,000.00"

// Euro
new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
  .format(1000); // "1.000,00 €"
```

---

## Responsive Grid Systems

### Tailwind Grid Classes

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
```

| Class | Breakpoint | Columns |
|-------|------------|---------|
| `grid-cols-2` | Default (0px+) | 2 |
| `sm:grid-cols-3` | 640px+ | 3 |
| `md:grid-cols-4` | 768px+ | 4 |
| `lg:grid-cols-6` | 1024px+ | 6 |

### Responsive Progression

```
Mobile (< 640px):
┌────┐ ┌────┐
│    │ │    │
└────┘ └────┘
┌────┐ ┌────┐
│    │ │    │
└────┘ └────┘

Tablet (640px - 1024px):
┌────┐ ┌────┐ ┌────┐ ┌────┐
│    │ │    │ │    │ │    │
└────┘ └────┘ └────┘ └────┘

Desktop (1024px+):
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│    │ │    │ │    │ │    │ │    │ │    │
└────┘ └────┘ └────┘ └────┘ └────┘ └────┘
```

### Gap Utilities

```tsx
gap-4      // 1rem gap on all sides
gap-x-4    // Horizontal gap only
gap-y-6    // Vertical gap only
```

### Grid vs Flexbox

| Use Grid | Use Flexbox |
|----------|-------------|
| Fixed columns | Variable width items |
| 2D layouts | 1D layouts (row OR column) |
| Equal-sized items | Items based on content |
| Product grids | Navigation, buttons |

---

## Custom Hooks for Data Fetching

### Pattern: SWR-based Hook

```typescript
// hooks/useFeaturedProducts.ts
import useSWR from 'swr';
import api from '@/lib/api';
import type { ProductListItem, ApiResponse } from '@/types';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useFeaturedProducts(limit: number = 8) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ProductListItem[]>>(
    `/products?featured=true&limit=${limit}`,
    fetcher
  );

  return {
    products: data?.data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
```

### Hook Return Values

| Value | Type | Purpose |
|-------|------|---------|
| `products` | `ProductListItem[]` | The data (with fallback) |
| `isLoading` | `boolean` | Show skeleton loaders |
| `isError` | `boolean` | Show error state |
| `error` | `Error` | Error details |
| `mutate` | `function` | Refetch/revalidate data |

### Default Value Pattern

```typescript
// With nullish coalescing
products: data?.data ?? []

// Equivalent to:
products: data?.data !== null && data?.data !== undefined 
  ? data.data 
  : []
```

This ensures `products` is always an array, even during loading.

### Parameterized Hooks

```typescript
// Hook with parameters
export function useProducts(params?: {
  categoryId?: string;
  brandId?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params?.search) searchParams.set('search', params.search);
  
  const url = `/products?${searchParams.toString()}`;
  
  return useSWR(url, fetcher);
}

// Usage
const { products } = useProducts({ categoryId: 'electronics' });
const { products } = useProducts({ search: 'prestige' });
```

---

## Client vs Server Components

### The 'use client' Directive

```tsx
'use client';  // Must be first line

import { useState } from 'react';
```

### When to Use Client Components

| Feature | Requires Client Component |
|---------|--------------------------|
| `useState`, `useEffect` | ✅ Yes |
| Event handlers (`onClick`) | ✅ Yes |
| Browser APIs (`localStorage`) | ✅ Yes |
| SWR/React Query hooks | ✅ Yes |
| Just rendering props | ❌ No |

### Our Homepage Components

| Component | Type | Why |
|-----------|------|-----|
| `HeroBanner` | Client | Uses `useState`, carousel API |
| `CategoryGrid` | Client | Uses `useMainCategories` hook |
| `ProductCard` | Client | Uses `useIsInWishlist`, event handlers |
| `FeaturedProducts` | Client | Uses `useFeaturedProducts` hook |
| `StoreInfo` | Server | Just renders static content |

### Server Component Advantages

- Smaller JavaScript bundle
- Data fetching on server
- No hydration needed
- Better SEO

### Client Component Tradeoffs

- Larger bundle (includes React hooks)
- Requires hydration
- Interactive features possible

---

## Common Patterns

### 1. Barrel Exports

```typescript
// components/home/index.ts
export { HeroBanner } from './HeroBanner';
export { CategoryGrid } from './CategoryGrid';
export { ProductCard, ProductCardSkeleton } from './ProductCard';
export { FeaturedProducts } from './FeaturedProducts';
export { StoreInfo } from './StoreInfo';
```

### 2. Event Handler with Link Prevention

```tsx
// When button is inside a Link
const handleClick = (e: React.MouseEvent) => {
  e.preventDefault();     // Stop link navigation
  e.stopPropagation();    // Stop event bubbling
  // Handle click...
};
```

### 3. Conditional Badge Rendering

```tsx
{product.discountPercentage > 0 && (
  <Badge variant="secondary">
    {product.discountPercentage}% OFF
  </Badge>
)}
```

### 4. Image with Fallback

```tsx
<Image
  src={category.imageUrl || `https://placehold.co/200x200?text=${category.name}`}
  alt={category.name}
/>
```

### 5. Loading State Pattern

```tsx
function DataComponent() {
  const { data, isLoading, isError } = useData();

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorMessage />;
  if (data.length === 0) return <EmptyState />;
  
  return <DataList data={data} />;
}
```

### 6. Responsive Show/Hide

```tsx
{/* Desktop only */}
<div className="hidden md:flex">...</div>

{/* Mobile only */}
<div className="flex md:hidden">...</div>

{/* Visible from tablet up */}
<div className="hidden sm:block">...</div>
```

### 7. Group Hover Effects

```tsx
<div className="group">
  <Image className="group-hover:scale-105" />
  <h3 className="group-hover:text-primary" />
</div>
```

---

## Key Takeaways

1. **Component Composition**: Break pages into focused components, each handling its own data and states

2. **Carousel with Embla**: Use `setApi` to access methods, `useRef` for plugins, options for behavior

3. **Responsive Images**: Use conditional rendering with breakpoint classes for different image sources

4. **Skeleton Loaders**: Match skeleton dimensions to actual content for smooth loading experience

5. **Currency Formatting**: Use `Intl.NumberFormat` with locale for proper formatting

6. **Grid Responsiveness**: Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) change grid columns

7. **Custom Hooks**: Encapsulate data fetching logic, always return loading/error states

8. **Client Components**: Required for interactivity, hooks, and browser APIs

---

*Last Updated: January 14, 2026*
