# STEP 8: PRODUCT DETAIL PAGE - DETAILED BREAKDOWN

**Date Completed**: January 21, 2026  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [URL Strategy: Shareable Variant URLs](#url-strategy-shareable-variant-urls)
3. [Schema Evolution: Adding Variant Slugs](#schema-evolution-adding-variant-slugs)
4. [New TypeScript Interfaces](#new-typescript-interfaces)
5. [Component Architecture](#component-architecture)
6. [Responsive Image Gallery Pattern](#responsive-image-gallery-pattern)
7. [Variant Selection and State Sync](#variant-selection-and-state-sync)
8. [Related Products Algorithm](#related-products-algorithm)
9. [Wishlist Integration at Variant Level](#wishlist-integration-at-variant-level)
10. [Root Layout vs Page Layout Anti-Pattern](#root-layout-vs-page-layout-anti-pattern)
11. [Loading and Error States](#loading-and-error-states)

---

## Overview

Step 8 introduced the Product Detail Page (PDP) - a critical e-commerce page that displays complete product information with variant selection, image gallery, specifications, and related products.

**What was accomplished:**
- ✅ Shareable variant URLs via query params (`?variant=3-litre`)
- ✅ Responsive image gallery (mobile carousel + desktop thumbnails)
- ✅ Variant selector with pill buttons and stock status
- ✅ Product info component with wishlist integration
- ✅ Accordion for specifications, delivery, and return policy
- ✅ Related products API with priority-based fallback
- ✅ Full loading skeleton and error states

**Files Created:**
```
store/src/
├── app/products/[slug]/
│   ├── page.tsx               # Main product detail page
│   └── not-found.tsx          # Custom 404 for products
├── app/api/products/[slug]/related/
│   └── route.ts               # Related products API
└── components/products/
    ├── ProductImageGallery.tsx   # Hybrid carousel/thumbnails
    ├── VariantSelector.tsx       # Variant pill buttons
    ├── ProductInfo.tsx           # Name, price, wishlist
    ├── ProductAccordion.tsx      # Specs, delivery, returns
    └── RelatedProducts.tsx       # Horizontal carousel
```

**Files Modified:**
```
store/src/
├── mock_data/products.json          # Added slug field to all variants
├── types/index.ts                   # New ProductVariant, ProductDetail
├── app/api/products/route.ts        # Added variantSlug to response
├── app/api/products/[slug]/route.ts # Added stockQuantity, images
├── app/api/wishlist/route.ts        # Added variantSlug to response
├── components/products/ProductCard.tsx # Updated link format
└── components/products/index.ts     # New exports
```

---

## URL Strategy: Shareable Variant URLs

### The Problem

E-commerce sites need shareable URLs. When a user selects a specific variant (e.g., "3 Litre" pressure cooker), sharing the URL should take others to that exact variant.

### Options Considered

| Option | URL Format | Trade-offs |
|--------|------------|------------|
| Variant in Path | `/products/prestige-cooker/3-litre` | Requires nested routing, complex |
| Variant in Query | `/products/prestige-cooker?variant=3-litre` | Simpler, SEO-friendly, shareable ✅ |
| Variant ID in Query | `/products/prestige-cooker?variant=prod-003` | Not human-readable |

### Chosen Approach: Query Param with Slug

```
/products/prestige-deluxe-alpha-pressure-cooker?variant=3-litre
```

**Why this works:**
- **Shareable**: Copy URL → paste → same variant shown
- **Human-readable**: Users understand "3-litre" in URL
- **SEO-friendly**: Main product indexed, variants as variations
- **Simple routing**: No nested dynamic segments

### Implementation

```tsx
// Reading variant from URL
const variantSlug = searchParams.get('variant');

// Finding variant by slug
const variant = product.variants.find((v) => v.slug === variantSlug);

// Updating URL on variant change
const handleVariantChange = (variantId: string) => {
  const variant = product.variants.find((v) => v.id === variantId);
  if (variant) {
    router.replace(`/products/${slug}?variant=${variant.slug}`, { scroll: false });
  }
};
```

**Key Detail**: Using `router.replace()` instead of `router.push()` prevents every variant click from creating a new history entry.

---

## Schema Evolution: Adding Variant Slugs

### The Change

Each product variant needed a human-readable `slug` field for the URL strategy.

**Before:**
```json
{
  "id": "prod-prestige-iris-750w-3jar",
  "name": "750W - 3 Jar",
  "sku": "PRSIRISMG-750-3J"
}
```

**After:**
```json
{
  "id": "prod-prestige-iris-750w-3jar",
  "name": "750W - 3 Jar",
  "slug": "750w-3-jar",
  "sku": "PRSIRISMG-750-3J"
}
```

### Slug Generation Pattern

Slugs were derived from variant names using this transformation:
- Lowercase all characters
- Replace spaces with hyphens
- Remove special characters

| Variant Name | Generated Slug |
|-------------|----------------|
| 750W - 3 Jar | `750w-3-jar` |
| 3 Litre | `3-litre` |
| 1200mm Brown | `1200mm-brown` |
| 5 Piece Set | `5-piece-set` |

### Files Updated for Schema Change

The `slug` field needed to be added across multiple files:

1. **Mock Data** (`products.json`): Added to all 20 variants
2. **API Routes**: Updated interfaces to include `slug`
3. **TypeScript Types**: Added to `ProductVariant` interface
4. **Product List API**: Added `variantSlug` to `ProductListItem` response
5. **Wishlist API**: Added `variantSlug` to enriched response

---

## New TypeScript Interfaces

### ProductVariant Interface

```typescript
export interface ProductVariant {
  id: string;
  slug: string;              // NEW: Human-readable URL slug
  name: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  stockQuantity: number;     // NEW: For stock status display
  isDefaultVariant: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  attributes: Record<string, string | number | boolean>;  // Flexible typing
  images: ProductImage[];    // Variant-specific images
}
```

### ProductDetail Interface

This is the complete response for the product detail page:

```typescript
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    path: string;
    breadcrumb: { name: string; slug: string }[];
  };
  variants: ProductVariant[];
  images: ProductImage[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}
```

### ProductListItem Updates

Added optional variant fields for list views:

```typescript
export interface ProductListItem {
  // ... existing fields
  variantSlug?: string;   // NEW: For building product URLs
  variantName?: string;   // NEW: For display if needed
}
```

---

## Component Architecture

### Component Hierarchy

```
ProductDetailPage (page.tsx)
├── Breadcrumb
├── ProductImageGallery
│   ├── EmblaCarousel (main image)
│   ├── Dot indicators (mobile)
│   └── Thumbnail grid (desktop)
├── ProductInfo
│   ├── Brand name
│   ├── Product name + variant name
│   ├── Rating stars
│   ├── Price with discount
│   ├── Stock status badges
│   └── Wishlist button
├── VariantSelector
│   └── Pill buttons for each variant
├── ProductAccordion
│   ├── Specifications table
│   ├── Delivery information
│   └── Return policy
└── RelatedProducts
    └── Horizontal ProductCard carousel
```

### Props Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  ProductDetailPage                                               │
│  - Fetches product with useProduct(slug)                        │
│  - Manages selectedVariant state                                │
│  - Syncs variant with URL                                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┬─────────────────┐
    ▼                 ▼                 ▼                 ▼
ProductInfo      VariantSelector   ProductAccordion  ProductImageGallery
selectedVariant  variants[]        selectedVariant   images[]
productGroupId   selectedVariantId                   (filtered by variant)
                 onVariantChange
```

### Data Ownership

| Component | Owns State | Receives Props |
|-----------|-----------|----------------|
| ProductDetailPage | `selectedVariant` | None (fetches data) |
| VariantSelector | None | `variants`, `selectedVariantId`, `onVariantChange` |
| ProductInfo | `isWishlistUpdating` | `selectedVariant`, `productGroupId` |
| ProductAccordion | None | `selectedVariant` |
| ProductImageGallery | `selectedIndex` | `images` |

---

## Responsive Image Gallery Pattern

### Hybrid Approach

The gallery uses different interaction patterns per device:

| Device | Main Image | Navigation |
|--------|-----------|------------|
| Mobile | Swipe carousel | Dot indicators |
| Desktop | Click carousel | Thumbnail strip below |

### Implementation with Embla Carousel

```tsx
const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

// Sync thumbnail selection with carousel
const onSelect = useCallback(() => {
  if (!emblaApi) return;
  setSelectedIndex(emblaApi.selectedScrollSnap());
}, [emblaApi]);

useEffect(() => {
  if (!emblaApi) return;
  emblaApi.on('select', onSelect);
  return () => emblaApi.off('select', onSelect);
}, [emblaApi, onSelect]);

// Thumbnail click scrolls carousel
const handleThumbnailClick = (index: number) => {
  emblaApi?.scrollTo(index);
};
```

### Responsive Visibility

```tsx
{/* Dot indicators - mobile only */}
<div className="md:hidden">
  {images.map((_, i) => (
    <button className={cn(
      i === selectedIndex ? 'bg-primary' : 'bg-gray-300'
    )} />
  ))}
</div>

{/* Thumbnails - desktop only */}
<div className="hidden md:flex gap-2">
  {images.map((img, i) => (
    <button className={cn(
      i === selectedIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
    )} />
  ))}
</div>
```

### Image Priority and Sizing

```tsx
<Image
  src={image.url}
  priority={index === 0}  // Preload first image
  sizes="(max-width: 768px) 100vw, 50vw"  // Responsive sizing
  className="object-contain"  // Don't crop product images
/>
```

---

## Variant Selection and State Sync

### State Flow

```
URL (?variant=3-litre)
        ↓
   useEffect reads URL
        ↓
   Find variant by slug
        ↓
   setSelectedVariant(variant)
        ↓
   Components re-render with new variant
        ↓
   User clicks different variant
        ↓
   handleVariantChange(variantId)
        ↓
   setSelectedVariant + router.replace
        ↓
   URL updates (no page reload)
```

### Graceful Fallback

```tsx
useEffect(() => {
  if (!product) return;

  if (variantSlug) {
    const variant = product.variants.find((v) => v.slug === variantSlug);
    if (variant) {
      setSelectedVariant(variant);
    } else {
      // Variant not found (maybe deleted), use default
      setSelectedVariant(product.variants[0]);
      toast.error('Selected variant not found, showing default');
    }
  } else {
    // No variant in URL, use first
    setSelectedVariant(product.variants[0]);
  }
}, [product, variantSlug]);
```

### Stock Status Visual States

```tsx
// VariantSelector.tsx
const isInStock = variant.stockQuantity > 0;

<button
  disabled={!isInStock}
  className={cn(
    isSelected
      ? 'bg-primary text-white border-primary'
      : isInStock
      ? 'hover:border-primary'
      : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
  )}
>
```

---

## Related Products Algorithm

### Priority-Based Fallback

The API finds related products using this priority:

```
Priority 1: Same category (excluding current product)
     ↓ If not enough
Priority 2: Same brand (excluding already selected)
     ↓ If still not enough
Priority 3: Featured products (excluding already selected)
     ↓
Return up to 6 products
```

### Implementation

```typescript
// First: Same category
const sameCategoryGroups = productGroups.filter(
  (pg) => pg.categoryId === currentProductGroup.categoryId &&
          pg.id !== currentProductGroup.id &&
          pg.status === 'ACTIVE'
);
relatedGroups.push(...sameCategoryGroups);

// Second: Same brand (if needed)
if (relatedGroups.length < limit) {
  const sameBrandGroups = productGroups.filter(
    (pg) => pg.brandId === currentProductGroup.brandId &&
            !relatedGroups.find((rg) => rg.id === pg.id)
  );
  relatedGroups.push(...sameBrandGroups);
}

// Third: Featured products (if still needed)
if (relatedGroups.length < limit) {
  const featuredGroups = productGroups.filter(
    (pg) => pg.isFeatured &&
            !relatedGroups.find((rg) => rg.id === pg.id)
  );
  relatedGroups.push(...featuredGroups);
}
```

### Why This Order?

| Priority | Rationale |
|----------|-----------|
| Same Category | User looking at mixer likely wants to compare other mixers |
| Same Brand | Brand loyalty - if they like Prestige, show more Prestige |
| Featured | High-quality products as last resort |

---

## Wishlist Integration at Variant Level

### Key Decision: Wishlist Saves Variant, Not Just Product

When adding to wishlist, we save the specific variant (e.g., "3 Litre" pressure cooker), not just the product group.

**Why?**
- User might want the 3L version but not the 5L version
- Price differs between variants
- Stock status differs between variants

### Implementation

```tsx
// ProductInfo.tsx
const wishlistItem = wishlist?.find(
  (item: WishlistItem) => 
    item.productGroupId === productGroupId && 
    item.variantId === selectedVariant.id
);

const handleWishlistToggle = async () => {
  if (isInWishlist) {
    await removeFromWishlist(wishlistItem.id);
  } else {
    await addToWishlist(productGroupId, selectedVariant.id);
  }
};
```

### Re-checking When Variant Changes

Because wishlist is checked against `selectedVariant.id`, the wishlist button state automatically updates when user switches variants.

---

## Root Layout vs Page Layout Anti-Pattern

### The Bug

When first implemented, the product detail page had **two headers** appearing - one from root layout, one from the page component.

### Why It Happened

```tsx
// layout.tsx (root)
export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <MainLayout>  {/* ← Header + Footer here */}
        {children}
      </MainLayout>
    </AuthProvider>
  );
}

// products/[slug]/page.tsx (WRONG)
export default function ProductDetailPage() {
  return (
    <MainLayout>  {/* ← Duplicate Header + Footer! */}
      <div>...</div>
    </MainLayout>
  );
}
```

### The Fix

Page components should NOT wrap with `MainLayout` since it's already applied at root:

```tsx
// products/[slug]/page.tsx (CORRECT)
export default function ProductDetailPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Content only - no MainLayout wrapper */}
    </div>
  );
}
```

### Rule of Thumb

| Location | Should Use MainLayout? |
|----------|----------------------|
| `layout.tsx` (root) | ✅ Yes - once for entire app |
| Individual pages | ❌ No - inherited from root |
| Admin pages (future) | Custom AdminLayout instead |

---

## Loading and Error States

### Component-Level Skeletons

Each component exports its own skeleton for consistent loading states:

```tsx
// ProductImageGallerySkeleton
<div className="space-y-4">
  <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
  <div className="hidden md:flex gap-2">
    {[...Array(4)].map((_, i) => (
      <div className="w-20 h-20 bg-gray-100 rounded-lg animate-pulse" />
    ))}
  </div>
</div>
```

### Error State with Retry

```tsx
if (isError) {
  return (
    <div className="text-center py-16">
      <h1>Something went wrong</h1>
      <p>{error?.message || 'Failed to load product details'}</p>
      <Button onClick={() => mutate()}>Try Again</Button>
    </div>
  );
}
```

### Invalid Variant Handling

```tsx
if (variantSlug) {
  const variant = product.variants.find((v) => v.slug === variantSlug);
  if (!variant) {
    toast.error('Selected variant not found, showing default');
    setSelectedVariant(product.variants[0]);
  }
}
```

---

## Key Technical Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Variant in URL | Query param with slug | Shareable, human-readable, simple routing |
| Image gallery | Embla Carousel (already installed) | Reuse existing dependency, touch-friendly |
| Variant state | URL as source of truth | Bookmarkable, back button works |
| Related products | Server-side with fallback logic | Category → Brand → Featured priority |
| Wishlist scope | Variant-level (not product group) | Price/stock differ per variant |
| Layout wrapper | Root only | Avoid duplicate headers |
| Stock display | Pill buttons with disabled state | Visual clarity for availability |
| Specs display | Accordion with table | Collapsible, organized information |

---

## Files Reference

### New Components
- `ProductImageGallery.tsx` (171 lines) - Hybrid carousel/thumbnail gallery
- `VariantSelector.tsx` (73 lines) - Variant pill buttons with stock states
- `ProductInfo.tsx` (182 lines) - Product info with wishlist
- `ProductAccordion.tsx` (162 lines) - Specs, delivery, returns
- `RelatedProducts.tsx` (120 lines) - Horizontal product carousel

### New API Routes
- `api/products/[slug]/related/route.ts` (159 lines) - Related products with fallback

### Schema Updates
- Added `slug` to 20 variants in `products.json`
- Added `stockQuantity` to variant response
- Added `variantSlug`, `variantName` to `ProductListItem`
