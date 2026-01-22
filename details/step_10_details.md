# STEP 10: WISHLIST FUNCTIONALITY - DETAILED BREAKDOWN

**Date Completed**: January 22, 2026  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [Protected Route Pattern](#protected-route-pattern)
3. [WishlistProductCard vs ProductCard Design Decision](#wishlistproductcard-vs-productcard-design-decision)
4. [Auth-Gated Actions with Return URL](#auth-gated-actions-with-return-url)
5. [Toast Notification Integration](#toast-notification-integration)
6. [Product Status Handling in Wishlist](#product-status-handling-in-wishlist)
7. [API Enhancement: Status & Stock Fields](#api-enhancement-status--stock-fields)
8. [Optimistic UI Considerations](#optimistic-ui-considerations)

---

## Overview

Step 10 completed the wishlist feature by adding the dedicated wishlist page and enhancing existing components with proper authentication flows and user feedback. The wishlist API and hooks existed from Step 4, but lacked the frontend page and proper auth handling.

**What was accomplished:**
- ✅ Protected `/wishlist` page with login redirect
- ✅ Dedicated `WishlistProductCard` with remove functionality
- ✅ Auth check + redirect on ProductCard and ProductInfo wishlist actions
- ✅ Toast notifications for all wishlist operations
- ✅ Out-of-stock and unavailable product indicators

**Files Created:**
```
store/src/
├── app/wishlist/
│   └── page.tsx                      # Protected wishlist page
└── components/products/
    └── WishlistProductCard.tsx       # Specialized card with remove button
```

**Files Modified:**
```
store/src/
├── components/products/ProductCard.tsx     # Auth check, toasts
├── components/products/ProductInfo.tsx     # Auth check, redirect, toasts
├── components/products/index.ts            # Export new component
├── app/api/wishlist/route.ts               # Status, stockQuantity in response
└── types/index.ts                          # ProductListItem status fields
```

---

## Protected Route Pattern

### The Pattern

A protected route must:
1. Show loading while checking auth
2. Redirect if not authenticated
3. Render content only when authenticated

### Implementation

```typescript
export default function WishlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Step 1: Redirect effect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?returnUrl=/wishlist');
    }
  }, [authLoading, isAuthenticated, router]);

  // Step 2: Loading state
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Step 3: Guard clause (prevents flash of content)
  if (!isAuthenticated) {
    return null;
  }

  // Step 4: Actual content
  return <WishlistContent />;
}
```

### Why the Guard Clause?

Without `if (!isAuthenticated) return null`, users would briefly see the wishlist content before the redirect happens. The `useEffect` runs after render, so a guard clause prevents the flash.

### Dependency Array

```typescript
useEffect(() => {
  // redirect logic
}, [authLoading, isAuthenticated, router]);
```

The effect re-runs when:
- `authLoading` changes (auth check completed)
- `isAuthenticated` changes (user logs out)
- `router` changes (shouldn't happen, but included for exhaustive deps)

---

## WishlistProductCard vs ProductCard Design Decision

### The Problem

The wishlist page needs product cards with:
- Remove button instead of toggle heart
- Status indicators (out of stock, unavailable)
- Slightly different interaction patterns

### Options Considered

| Approach | Pros | Cons |
|----------|------|------|
| Add props to ProductCard | Single component, DRY | Complex conditional logic, bloated component |
| Create WishlistProductCard | Clean separation, focused responsibility | Some code duplication |

### Decision: Separate Component

Created `WishlistProductCard` because:
1. **Different primary action**: Remove vs. Toggle
2. **Different data source**: Takes `WishlistItem` (with enriched product data) vs. `ProductListItem`
3. **Status handling**: Needs to handle unavailable products gracefully
4. **Simpler maintenance**: Each component has clear responsibility

### Shared Utilities

To avoid duplication, shared utilities are imported:

```typescript
import { formatPrice } from './ProductCard';
```

---

## Auth-Gated Actions with Return URL

### The Pattern

When a guest tries to perform an authenticated action:
1. Capture the current URL
2. Redirect to login with `returnUrl` parameter
3. After login, redirect back to original page

### Implementation in ProductCard

```typescript
const handleWishlistToggle = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  // TODO: After backend integration, check for JWT token existence
  if (!isAuthenticated) {
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    return;
  }

  // Proceed with wishlist operation...
};
```

### Why `window.location` Instead of `usePathname`?

`window.location.search` captures query parameters (e.g., `?variant=3-litre`), which is essential for product detail pages. The Next.js `usePathname` hook only returns the path, not the query string.

### The TODO Comment

```typescript
// TODO: After backend integration, check for JWT token existence
```

Currently, we use `isAuthenticated` from AuthContext which checks the mock token. In production with a real backend, the check should verify JWT token validity/expiration directly.

---

## Toast Notification Integration

### Sonner Library

The project uses `sonner` (already installed in Step 1) for toast notifications. It provides a clean API:

```typescript
import { toast } from 'sonner';

toast.success('Added to wishlist');
toast.error('Failed to update wishlist. Please try again.');
```

### Notification Strategy

| Action | Toast Type | Message |
|--------|------------|---------|
| Add to wishlist | Success | "Added to wishlist" |
| Remove from wishlist | Success | "Removed from wishlist" |
| API error | Error | "Failed to update wishlist. Please try again." |

### Error Handling Pattern

```typescript
try {
  if (isInWishlist) {
    await removeFromWishlist(wishlistItem.id);
    toast.success('Removed from wishlist');
  } else {
    await addToWishlist(productGroupId, variantId);
    toast.success('Added to wishlist');
  }
  refreshWishlist();
} catch (error) {
  console.error('Wishlist error:', error);
  toast.error('Failed to update wishlist. Please try again.');
}
```

The toast is shown **after** the API call succeeds, not optimistically. This ensures accuracy over speed.

---

## Product Status Handling in Wishlist

### Status Types

| Status | Meaning | UI Treatment |
|--------|---------|--------------|
| ACTIVE | Product is available | Normal card |
| INACTIVE | Product was archived/disabled | "Unavailable" badge, grayed out |
| Out of Stock | stockQuantity = 0 | "Out of Stock" badge, 75% opacity |

### Detection Logic

```typescript
// Completely unavailable (product deleted or INACTIVE)
const isUnavailable = !product || product.sellingPrice === 0 || product.status === 'INACTIVE';

// Available but no stock
const isOutOfStock = product && product.stockQuantity === 0;
```

### Unavailable Product UI

For unavailable products, the card shows:
- Gray overlay with 75% opacity
- AlertTriangle icon instead of product image
- "Unavailable" destructive badge
- "This product is no longer available" message
- Remove button still functional

### Out of Stock UI

For out-of-stock products:
- "Out of Stock" badge (replaces discount badge position)
- 75% card opacity
- Still clickable to view product details

### Badge Priority

Since badges occupy the same position (top-left), priority matters:

```typescript
{isOutOfStock ? (
  <Badge>Out of Stock</Badge>
) : hasDiscount ? (
  <Badge>X% OFF</Badge>
) : null}
```

Out of Stock takes priority over discount display.

---

## API Enhancement: Status & Stock Fields

### Previous Response

```typescript
product: {
  id, name, slug, variantSlug, variantName,
  brandName, mrp, sellingPrice, discountPercentage,
  averageRating, totalReviews, primaryImage
}
```

### Enhanced Response

```typescript
product: {
  ...previousFields,
  status: 'ACTIVE' | 'INACTIVE',  // NEW
  stockQuantity: number           // NEW
}
```

### Status Derivation

```typescript
const isProductUnavailable = !productGroup || productGroup.status !== 'ACTIVE';
const isVariantUnavailable = !variant || variant.status !== 'ACTIVE';
const isUnavailable = isProductUnavailable || isVariantUnavailable;

return {
  ...item,
  product: {
    ...productFields,
    status: isUnavailable ? 'INACTIVE' : 'ACTIVE',
    stockQuantity: variant?.stockQuantity ?? 0,
  }
};
```

### Type Update

Added optional fields to `ProductListItem`:

```typescript
export interface ProductListItem {
  // ...existing fields
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  stockQuantity?: number;
}
```

Optional because regular product grids don't need these fields; only wishlist uses them.

---

## Optimistic UI Considerations

### Current Approach: Wait for API

The current implementation waits for the API response before updating UI:

```typescript
try {
  await removeFromWishlist(wishlistItem.id);
  refreshWishlist();  // Re-fetch from server
  toast.success('Removed from wishlist');
} catch (error) {
  toast.error('Failed to remove item.');
}
```

### Alternative: Optimistic Updates

```typescript
// 1. Immediately update UI
mutate(optimisticData, false);
toast.success('Removed from wishlist');

try {
  await removeFromWishlist(wishlistItem.id);
} catch (error) {
  // 2. Rollback on error
  mutate();  // Re-fetch original data
  toast.error('Failed to remove. Item restored.');
}
```

### Why Not Optimistic?

For Phase 1, the wait-for-API approach was chosen because:
1. **Simpler implementation**: No rollback logic needed
2. **Mock API is fast**: 200ms delay is acceptable
3. **Accuracy**: UI always reflects server state
4. **Error handling**: Easier to reason about

Optimistic updates can be added in Phase 2 if real API latency becomes a UX issue.

---

## Key Takeaways

1. **Protected routes need three states**: Loading, redirecting, and authenticated
2. **Separate components for different contexts**: WishlistProductCard vs ProductCard keeps each focused
3. **Return URL pattern**: Essential for interrupted flows (guest → login → continue)
4. **Toast after success, not optimistically**: Simpler and more accurate for Phase 1
5. **Status fields in API**: Enable rich UI states without additional API calls
