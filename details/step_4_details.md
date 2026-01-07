# STEP 4: MOCK DATA AND API ROUTES - DETAILED BREAKDOWN

**Date Completed**: January 7, 2026  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [What Are API Routes?](#what-are-api-routes)
3. [Next.js App Router API Structure](#nextjs-app-router-api-structure)
4. [Dynamic Routes with Parameters](#dynamic-routes-with-parameters)
5. [Request and Response Handling](#request-and-response-handling)
6. [Importing and Type Casting JSON](#importing-and-type-casting-json)
7. [Authentication with Tokens](#authentication-with-tokens)
8. [Pagination Pattern](#pagination-pattern)
9. [Search and Filtering](#search-and-filtering)
10. [In-Memory Storage Pattern](#in-memory-storage-pattern)
11. [Helper Functions and DRY Principle](#helper-functions-and-dry-principle)
12. [Common Patterns](#common-patterns)

---

## Overview

Step 4 created local API endpoints that serve mock data, enabling the frontend to work with realistic data fetching patterns before connecting to a real backend.

**What was accomplished:**
- ✅ Created 11 API route files
- ✅ Implemented authentication endpoints (send-otp, verify-otp, me, logout)
- ✅ Implemented data endpoints (categories, products, brands, banners)
- ✅ Implemented wishlist with in-memory storage
- ✅ Added search, filtering, and pagination
- ✅ Created reusable helper functions

**Files Created:**
```
store/src/
├── lib/
│   └── mock-helpers.ts          # Shared utility functions
└── app/api/
    ├── auth/
    │   ├── send-otp/route.ts
    │   ├── verify-otp/route.ts
    │   ├── me/route.ts
    │   └── logout/route.ts
    ├── categories/
    │   ├── route.ts
    │   └── [slug]/route.ts
    ├── products/
    │   ├── route.ts
    │   └── [slug]/route.ts
    ├── brands/route.ts
    ├── banners/route.ts
    └── wishlist/route.ts
```

---

## What Are API Routes?

### The Concept

API Routes let you create **backend endpoints** within your Next.js application. Instead of setting up a separate server, you define HTTP handlers directly in your project.

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR NEXT.JS APP                         │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   FRONTEND (React)  │───▶│   API ROUTES (Node.js)      │ │
│  │   /pages, /app      │    │   /app/api/*                │ │
│  │   Runs in Browser   │    │   Runs on Server            │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Why Use API Routes?

| Use Case | Explanation |
|----------|-------------|
| **Mock Backend** | Develop frontend without waiting for real backend |
| **Proxy Requests** | Hide API keys, transform requests |
| **BFF Pattern** | Backend-for-Frontend, aggregate multiple APIs |
| **Simple APIs** | Small apps that don't need separate server |

### API Routes vs Real Backend

For this project, API routes are **temporary**:

```
Phase 1 (Now):
Frontend ──▶ Next.js API Routes ──▶ JSON files

Phase 2 (Later):
Frontend ──▶ Spring Boot Backend ──▶ PostgreSQL Database
```

When switching to Spring Boot, we just change one environment variable:
```env
# Phase 1
NEXT_PUBLIC_API_URL=/api

# Phase 2
NEXT_PUBLIC_API_URL=https://api.newguruenterprises.com/v1
```

---

## Next.js App Router API Structure

### File-Based Routing

In Next.js App Router, the file path determines the URL:

```
File Path                              URL
─────────────────────────────────────────────────────
app/api/products/route.ts         →   /api/products
app/api/categories/route.ts       →   /api/categories
app/api/auth/send-otp/route.ts    →   /api/auth/send-otp
```

### The route.ts Convention

Each API endpoint is defined in a file named `route.ts`:

```typescript
// app/api/products/route.ts

export async function GET(request: Request) {
  // Handle GET /api/products
  return Response.json({ products: [...] });
}

export async function POST(request: Request) {
  // Handle POST /api/products
  const body = await request.json();
  return Response.json({ created: true });
}
```

### HTTP Method Handlers

You export functions named after HTTP methods:

| Export | HTTP Method | Common Use |
|--------|-------------|------------|
| `GET` | GET | Fetch data |
| `POST` | POST | Create data, submit forms |
| `PUT` | PUT | Replace entire resource |
| `PATCH` | PATCH | Partial update |
| `DELETE` | DELETE | Remove data |

**Example with multiple methods:**
```typescript
// app/api/wishlist/route.ts

export async function GET(request: Request) {
  // Get user's wishlist
}

export async function POST(request: Request) {
  // Add item to wishlist
}

export async function DELETE(request: Request) {
  // Remove item from wishlist
}
```

---

## Dynamic Routes with Parameters

### The [slug] Pattern

Square brackets create dynamic route segments:

```
File Path                              URL Examples
───────────────────────────────────────────────────────────────
app/api/products/[slug]/route.ts  →   /api/products/prestige-mixer
                                  →   /api/products/bajaj-cooker
                                  →   /api/products/any-value-here
```

### Accessing Route Parameters

In Next.js 15+, params is a Promise that must be awaited:

```typescript
// app/api/products/[slug]/route.ts

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;  // "prestige-mixer"
  
  // Find product by slug
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    return Response.json(
      { success: false, error: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  
  return Response.json({ success: true, data: product });
}
```

### Multiple Dynamic Segments

You can have multiple parameters:

```
app/api/categories/[category]/products/[productId]/route.ts

URL: /api/categories/electronics/products/123
params: { category: 'electronics', productId: '123' }
```

---

## Request and Response Handling

### Reading Request Data

**Query Parameters:**
```typescript
export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  const page = searchParams.get('page');      // "1" or null
  const search = searchParams.get('search');  // "prestige" or null
  const limit = parseInt(searchParams.get('limit') || '24', 10);
}
```

**Request Body (POST/PUT/PATCH):**
```typescript
export async function POST(request: Request) {
  const body = await request.json();
  
  const { phone, otp } = body;
  // Use the data...
}
```

**Headers:**
```typescript
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  // "Bearer eyJhbGciOiJIUzI1NiIs..."
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);  // Remove "Bearer " prefix
  }
}
```

### Creating Responses

**Basic JSON Response:**
```typescript
return Response.json({ success: true, data: products });
```

**With Status Code:**
```typescript
return Response.json(
  { success: false, error: 'NOT_FOUND', message: 'Product not found' },
  { status: 404 }
);
```

**With Headers:**
```typescript
return new Response(JSON.stringify(data), {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'max-age=60',
  },
});
```

### Common HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not allowed |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (e.g., already in wishlist) |
| 500 | Server Error | Unexpected error |

---

## Importing and Type Casting JSON

### The Problem

When importing JSON files in TypeScript, the types are inferred from the actual data, which can be overly specific or incompatible:

```typescript
import productsData from '@/mock_data/products.json';

// TypeScript infers a very specific type based on actual JSON content
// This can cause issues when trying to use generic interfaces
```

### Solution: Type Casting with `unknown`

Cast through `unknown` to safely convert to your interface:

```typescript
import productsData from '@/mock_data/products.json';

interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  // ...
}

// Two-step cast: JSON → unknown → YourType
const { productGroups, products } = productsData as unknown as {
  productGroups: ProductGroup[];
  products: ProductVariant[];
};
```

### Why `as unknown as`?

Direct casting fails if types don't overlap:

```typescript
// ❌ Error: Types don't overlap
const data = jsonData as MyInterface;

// ✅ Works: Cast to unknown first
const data = jsonData as unknown as MyInterface;
```

`unknown` is TypeScript's "escape hatch" - you're telling the compiler "trust me, I know what this is."

### Defining Local Interfaces

For API routes, define interfaces locally rather than importing:

```typescript
// In the route file itself
interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId: string;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  status: string;
}

// Now use it
const { productGroups } = productsData as unknown as {
  productGroups: ProductGroup[];
};
```

This keeps the API route self-contained and avoids circular dependencies.

---

## Authentication with Tokens

### How Token Auth Works

```
1. User logs in
   Client ──POST /auth/verify-otp──▶ Server
   
2. Server returns token
   Client ◀──{ token: "abc123" }─── Server
   
3. Client stores token
   localStorage.setItem('auth_token', 'abc123')
   
4. Client sends token with requests
   Client ──GET /wishlist──▶ Server
          Authorization: Bearer abc123
   
5. Server validates token
   If valid → Return data
   If invalid → Return 401
```

### Mock Token Implementation

We use a simple base64-encoded JSON as our "token":

```typescript
// Generate token
export const generateToken = (userId: string): string => {
  const payload = {
    userId,
    iat: Date.now(),  // Issued at
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,  // Expires in 30 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

// Verify token
export const verifyToken = (token: string): { userId: string; exp: number } | null => {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded.exp < Date.now()) {
      return null;  // Token expired
    }
    return decoded;
  } catch {
    return null;  // Invalid token
  }
};
```

**Note:** This is NOT secure for production. Real JWTs are cryptographically signed.

### Extracting Token from Header

```typescript
export const getTokenFromHeader = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization');
  
  // Check format: "Bearer <token>"
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  // Extract token part
  return authHeader.slice(7);  // Remove "Bearer " (7 characters)
};
```

### Protected Route Pattern

```typescript
export async function GET(request: Request) {
  // 1. Extract token
  const token = getTokenFromHeader(request);
  
  if (!token) {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }
  
  // 2. Verify token
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return errorResponse('UNAUTHORIZED', 'Invalid or expired token', 401);
  }
  
  // 3. Use user ID from token
  const userId = decoded.userId;
  
  // 4. Return protected data
  return successResponse({ data: getUserData(userId) });
}
```

---

## Pagination Pattern

### Why Paginate?

Without pagination:
- Large datasets slow down responses
- Browser struggles with thousands of items
- Poor user experience

With pagination:
- Fast, consistent response times
- Load data as needed
- Better memory usage

### Pagination Parameters

```
GET /api/products?page=2&limit=24

page  = Which page to return (1-indexed)
limit = Items per page
```

### Pagination Response Structure

```typescript
{
  "success": true,
  "data": [...],  // 24 items
  "pagination": {
    "currentPage": 2,
    "totalPages": 5,
    "totalItems": 112,
    "itemsPerPage": 24,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

### Pagination Helper Function

```typescript
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const paginate = <T>(
  items: T[],
  page: number = 1,
  limit: number = 24
): PaginationResult<T> => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  
  // Ensure page is within bounds
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  
  // Calculate slice indices
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Get page of items
  const data = items.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};
```

### Using the Paginator

```typescript
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') || '24', 10), 100);
  
  // Get all items (filtered if needed)
  const allProducts = getProducts();
  
  // Paginate
  const result = paginate(allProducts, page, limit);
  
  return Response.json({ success: true, ...result });
}
```

---

## Search and Filtering

### Simple Text Search

```typescript
// Filter products by search term
if (search) {
  items = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brandName.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );
}
```

### Multiple Filters

```typescript
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  
  // Extract all filter params
  const search = searchParams.get('search')?.toLowerCase();
  const categoryId = searchParams.get('categoryId');
  const brandId = searchParams.get('brandId');
  const featured = searchParams.get('featured');
  
  // Start with all items
  let items = getAllProducts();
  
  // Apply filters progressively
  if (search) {
    items = items.filter(item => 
      item.name.toLowerCase().includes(search)
    );
  }
  
  if (categoryId) {
    items = items.filter(item => item.categoryId === categoryId);
  }
  
  if (brandId) {
    items = items.filter(item => item.brandId === brandId);
  }
  
  if (featured === 'true') {
    items = items.filter(item => item.isFeatured);
  }
  
  // Paginate filtered results
  const result = paginate(items, page, limit);
  
  return Response.json({ success: true, ...result });
}
```

### Category Hierarchy Filtering

When filtering by category, include products from child categories:

```typescript
// Get all category IDs including children
const getCategoryIdsWithChildren = (categoryId: string): string[] => {
  const ids: string[] = [categoryId];
  
  const addChildren = (parentId: string) => {
    const children = allCategories.filter(c => c.parentId === parentId);
    for (const child of children) {
      ids.push(child.id);
      addChildren(child.id);  // Recursive
    }
  };
  
  addChildren(categoryId);
  return ids;
};

// Usage
if (categoryId) {
  const categoryIds = getCategoryIdsWithChildren(categoryId);
  items = items.filter(item => categoryIds.includes(item.categoryId));
}
```

This way, filtering by "Electronics" also shows products in "Mixer Grinder" and "Fans".

---

## In-Memory Storage Pattern

### The Concept

For prototyping, store data in a JavaScript variable instead of a database:

```typescript
// Module-level variable persists between requests
const wishlistStore: Map<string, WishlistItem[]> = new Map();
```

### Why Use Map?

```typescript
// Map for key-value storage
const store = new Map<string, WishlistItem[]>();

// Set user's wishlist
store.set('user-123', [item1, item2]);

// Get user's wishlist
const wishlist = store.get('user-123') || [];

// Delete user's wishlist
store.delete('user-123');
```

**Map vs Object:**
| Feature | Map | Object |
|---------|-----|--------|
| Key types | Any | String/Symbol only |
| Size | `map.size` | `Object.keys(obj).length` |
| Iteration | Built-in | Need Object.entries() |
| Performance | Better for frequent add/delete | Better for static data |

### Wishlist Implementation

```typescript
// Module-level storage
const wishlistStore: Map<string, WishlistItem[]> = new Map();

// GET - Retrieve wishlist
export async function GET(request: Request) {
  const token = getTokenFromHeader(request);
  const decoded = verifyToken(token);
  
  const userId = decoded.userId;
  const wishlist = wishlistStore.get(userId) || [];
  
  return successResponse({ data: wishlist });
}

// POST - Add item
export async function POST(request: Request) {
  const { productGroupId, variantId } = await request.json();
  const userId = decoded.userId;
  
  const userWishlist = wishlistStore.get(userId) || [];
  
  // Check for duplicates
  const exists = userWishlist.some(
    item => item.productGroupId === productGroupId && item.variantId === variantId
  );
  
  if (exists) {
    return errorResponse('ALREADY_IN_WISHLIST', 'Already in wishlist', 409);
  }
  
  // Add new item
  const newItem = {
    id: `wishlist-${Date.now()}`,
    userId,
    productGroupId,
    variantId,
    addedAt: new Date().toISOString(),
  };
  
  userWishlist.push(newItem);
  wishlistStore.set(userId, userWishlist);
  
  return successResponse({ wishlistItem: newItem }, 201);
}

// DELETE - Remove item
export async function DELETE(request: Request) {
  const { itemId } = await request.json();
  const userId = decoded.userId;
  
  const userWishlist = wishlistStore.get(userId) || [];
  const index = userWishlist.findIndex(item => item.id === itemId);
  
  if (index === -1) {
    return errorResponse('NOT_FOUND', 'Item not found', 404);
  }
  
  userWishlist.splice(index, 1);
  wishlistStore.set(userId, userWishlist);
  
  return successResponse({ message: 'Removed from wishlist' });
}
```

### Limitations

⚠️ **Data resets when server restarts!**

This is fine for development but not for production. In production, use:
- Database (PostgreSQL, MongoDB)
- Redis for session data
- File-based persistence

---

## Helper Functions and DRY Principle

### DRY = Don't Repeat Yourself

Instead of repeating the same code in every route:

```typescript
// ❌ Repeated in every file
return Response.json({ success: true, data: result });
return Response.json({ success: false, error: 'NOT_FOUND' }, { status: 404 });
```

Create helper functions:

```typescript
// ✅ Defined once in mock-helpers.ts
export const successResponse = <T>(data: T, status: number = 200): Response => {
  return Response.json({ success: true, ...data }, { status });
};

export const errorResponse = (
  error: string,
  message: string,
  status: number = 400
): Response => {
  return Response.json({ success: false, error, message }, { status });
};
```

### Our Helper Functions

**mock-helpers.ts:**

| Function | Purpose |
|----------|---------|
| `delay(ms)` | Add artificial delay for realistic loading |
| `generateToken(userId)` | Create mock JWT token |
| `verifyToken(token)` | Decode and validate token |
| `getTokenFromHeader(request)` | Extract Bearer token from header |
| `getPlaceholderImage(text, w, h)` | Generate placeholder.co URL |
| `successResponse(data, status)` | Standard success response |
| `errorResponse(error, message, status)` | Standard error response |
| `paginate(items, page, limit)` | Paginate array of items |
| `getQueryParams(request)` | Parse URL search params |
| `getPaginationParams(searchParams)` | Extract page/limit from params |

### Placeholder Image Helper

```typescript
export const getPlaceholderImage = (
  text: string,
  width: number = 400,
  height: number = 400
): string => {
  const encodedText = encodeURIComponent(text.slice(0, 20));
  return `https://placehold.co/${width}x${height}/e2e8f0/475569?text=${encodedText}`;
};

// Usage
getPlaceholderImage('Prestige Mixer', 400, 400)
// → "https://placehold.co/400x400/e2e8f0/475569?text=Prestige%20Mixer"
```

---

## Common Patterns

### 1. Error Handling with Try-Catch

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Process...
    return successResponse({ data: result });
  } catch {
    return errorResponse('INVALID_REQUEST', 'Invalid request body', 400);
  }
}
```

### 2. Early Return Pattern

Exit early when conditions aren't met:

```typescript
export async function GET(request: Request) {
  const token = getTokenFromHeader(request);
  
  if (!token) {
    return errorResponse('UNAUTHORIZED', 'Token required', 401);
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return errorResponse('UNAUTHORIZED', 'Invalid token', 401);
  }
  
  // Happy path - user is authenticated
  return successResponse({ data: getUserData(decoded.userId) });
}
```

### 3. Data Transformation

Transform raw data into API response format:

```typescript
const transformToProductListItems = (): ProductListItem[] => {
  return productGroups.map(group => {
    const defaultVariant = variants.find(
      v => v.productGroupId === group.id && v.isDefaultVariant
    );
    const brand = brands.find(b => b.id === group.brandId);
    
    return {
      id: defaultVariant?.id,
      productGroupId: group.id,
      name: group.name,
      slug: group.slug,
      brandName: brand?.name || 'Unknown',
      mrp: defaultVariant?.mrp || 0,
      sellingPrice: defaultVariant?.sellingPrice || 0,
      // ... more fields
    };
  });
};
```

### 4. Flattening Hierarchical Data

For nested structures like categories:

```typescript
const flattenCategories = (categories: Category[]): Category[] => {
  const result: Category[] = [];
  
  const flatten = (cats: Category[]) => {
    for (const cat of cats) {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children);  // Recursive call
      }
    }
  };
  
  flatten(categories);
  return result;
};

// Input:
// [{ id: 1, children: [{ id: 2 }, { id: 3 }] }]

// Output:
// [{ id: 1, ... }, { id: 2, ... }, { id: 3, ... }]
```

### 5. Building Breadcrumbs

Generate navigation path for a category:

```typescript
const buildBreadcrumb = (category: Category): { name: string; slug: string }[] => {
  const breadcrumb = [{ name: 'Home', slug: '/' }];
  
  if (category.path) {
    // path = "electronics/mixer-grinder/3-jar"
    const pathParts = category.path.split('/').filter(Boolean);
    
    let currentPath = '';
    for (const part of pathParts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const cat = allCategories.find(c => c.path === currentPath);
      if (cat) {
        breadcrumb.push({ name: cat.name, slug: cat.slug });
      }
    }
  }
  
  return breadcrumb;
};

// Output:
// [
//   { name: 'Home', slug: '/' },
//   { name: 'Electronics', slug: 'electronics' },
//   { name: 'Mixer Grinder', slug: 'mixer-grinder' },
//   { name: '3 Jar', slug: '3-jar' }
// ]
```

---

## Key Takeaways

### What You Learned

1. **API Routes** are backend endpoints in Next.js
2. **route.ts** files define HTTP method handlers
3. **Dynamic routes** use `[param]` folder naming
4. **Request** object provides headers, body, URL params
5. **Response.json()** creates JSON responses
6. **Type casting** with `as unknown as` for JSON imports
7. **Token auth** pattern: generate → store → send → verify
8. **Pagination** splits large datasets into pages
9. **In-memory storage** is quick for prototyping
10. **Helper functions** reduce code duplication

### When to Apply These Patterns

| Pattern | Use When |
|---------|----------|
| API Routes | Building full-stack Next.js apps |
| Mock APIs | Frontend development before backend is ready |
| Token Auth | Protecting user-specific endpoints |
| Pagination | Returning large collections |
| In-memory Storage | Prototyping, development |
| Helper Functions | Same logic repeated 3+ times |

### Files to Remember

| File | Purpose |
|------|---------|
| `mock-helpers.ts` | Shared utilities for all routes |
| `route.ts` | Defines endpoint for that URL path |
| `[slug]/route.ts` | Dynamic endpoint with URL parameter |

---

## Testing the APIs

### Using Browser Console

```javascript
// Test categories
fetch('/api/categories').then(r => r.json()).then(console.log)

// Test products with search
fetch('/api/products?search=prestige').then(r => r.json()).then(console.log)

// Test single product
fetch('/api/products/prestige-iris-mixer-grinder').then(r => r.json()).then(console.log)

// Test auth flow
fetch('/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: '+919876543210' })
}).then(r => r.json()).then(console.log)
```

### Using REST Client (VS Code Extension)

Create a `.http` file:

```http
### Get all categories
GET http://localhost:3000/api/categories

### Search products
GET http://localhost:3000/api/products?search=prestige&page=1&limit=10

### Send OTP
POST http://localhost:3000/api/auth/send-otp
Content-Type: application/json

{
  "phone": "+919876543210"
}
```

---

## What's Next?

**Step 5: Homepage Implementation** will:
- Use `/api/banners` for hero carousel
- Use `/api/categories` for category grid
- Use `/api/products?featured=true` for featured products
- Create the visual homepage layout

The APIs are ready — now we build the UI to consume them!

---

*Document created: January 7, 2026*
