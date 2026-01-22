# API TEAM GUIDE

Backend API specification for the New Guru Enterprises online store. This document covers all endpoints the UI currently consumes.

**Last Updated**: January 22, 2026

---

## Quick Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/send-otp` | POST | ❌ | Send OTP to phone |
| `/api/auth/verify-otp` | POST | ❌ | Verify OTP, get token |
| `/api/auth/me` | GET | ✅ | Get current user |
| `/api/auth/profile` | PUT | ✅ | Update user profile |
| `/api/auth/logout` | POST | ✅ | Logout user |
| `/api/categories` | GET | ❌ | Get all categories (tree) |
| `/api/categories/{slug}` | GET | ❌ | Single category + breadcrumb |
| `/api/products` | GET | ❌ | List/search products |
| `/api/products/{slug}` | GET | ❌ | Product detail + variants |
| `/api/brands` | GET | ❌ | List all brands |
| `/api/banners` | GET | ❌ | Active homepage banners |
| `/api/wishlist` | GET | ✅ | Get user's wishlist |
| `/api/wishlist` | POST | ✅ | Add to wishlist |
| `/api/wishlist/{id}` | DELETE | ✅ | Remove from wishlist |

---

## 1. Base Configuration

### Base URL
- **Development**: `http://localhost:3000/api` (mock)
- **Production**: `https://api.newguruenterprises.com/v1`

Frontend uses env variable `NEXT_PUBLIC_API_URL` (defaults to `/api`).

### Authentication
- **Method**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Token Expiry**: 30 days
- **Storage**: Currently localStorage (plan: httpOnly cookies for production)

### Response Format

**Success**:
```json
{ "success": true, "data": {...}, "message": "..." }
```

**Paginated**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 120,
    "itemsPerPage": 24,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Error**:
```json
{ "success": false, "error": "ERROR_CODE", "message": "Human-readable message" }
```

---

## 2. Data Models

### 2.1 User
```typescript
{
  id: string;           // UUID
  phone: string;        // E.164 format: "+919876543210"
  name?: string;        // null for new users
  email?: string;
  address?: string;
  role: "USER" | "ADMIN";
  createdAt: string;    // ISO 8601
  updatedAt: string;
}
```

### 2.2 Category
```typescript
{
  id: string;
  name: string;
  slug: string;                    // URL-friendly: "mixer-grinder"
  description?: string;
  imageUrl?: string;
  parentId: string | null;         // null for root categories
  level: number;                   // 0 = root, 1 = sub, 2 = sub-sub
  path: string;                    // "electronics/mixer-grinder"
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
  productCount?: number;
  children?: Category[];           // Nested structure
}
```

### 2.3 Brand
```typescript
{
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  productCount?: number;
}
```

### 2.4 Product (List Item)
UI displays products in grids using this flattened structure:
```typescript
{
  id: string;                      // Variant ID
  productGroupId: string;          // Parent product group ID
  name: string;                    // Product group name
  slug: string;                    // Product group slug
  variantSlug?: string;            // Variant-specific slug
  variantName?: string;            // "750W - 3 Jar"
  brandName: string;
  categoryId?: string;
  categoryName?: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  averageRating: number;
  totalReviews: number;
  primaryImage: string;            // Single image URL
  isFeatured?: boolean;
  variantCount?: number;
}
```

### 2.5 Product (Detail)
Full product with all variants for product detail page:
```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: { id, name, slug, logoUrl? };
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
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
}
```

### 2.6 Product Variant
```typescript
{
  id: string;
  slug: string;              // "750w-3-jar"
  name: string;              // "750W - 3 Jar"
  sku: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  stockQuantity: number;
  isDefaultVariant: boolean;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  attributes: Record<string, string | number | boolean>;
  images: ProductImage[];
}
```

### 2.7 Product Image
```typescript
{
  id: string;
  productId: string;       // Variant ID
  url: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}
```

### 2.8 Banner
```typescript
{
  id: string;
  title: string;
  imageUrlDesktop: string;
  imageUrlMobile: string;
  linkType: "CATEGORY" | "BRAND" | "PRODUCT" | "COLLECTION" | "EXTERNAL";
  linkValue: string;       // Slug or URL based on linkType
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
  startDate?: string;
  endDate?: string;
}
```

### 2.9 Wishlist Item
```typescript
{
  id: string;
  userId: string;
  productGroupId: string;
  variantId: string;
  addedAt: string;
  product: ProductListItem;   // Enriched product details
}
```

---

## 3. Endpoint Specifications

### 3.1 Authentication

#### POST `/api/auth/send-otp`
Send OTP to user's phone number.

**Request**:
```json
{ "phone": "+919876543210" }
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

**Errors**:
- `400 INVALID_PHONE` - Invalid phone format
- `429 TOO_MANY_REQUESTS` - Rate limited

---

#### POST `/api/auth/verify-otp`
Verify OTP and return JWT token.

**Request**:
```json
{ "phone": "+919876543210", "otp": "123456" }
```

**Success Response** (200):
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { /* User object */ },
  "isNewUser": true
}
```

**Key Logic**:
- `isNewUser: true` → User's first login (name is null)
- `isNewUser: false` → Returning user
- Phone `+919849067667` → Admin role

**Errors**:
- `400 INVALID_OTP` - Wrong OTP
- `410 OTP_EXPIRED` - OTP expired

---

#### GET `/api/auth/me`
Get current authenticated user.

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "user": { /* User object */ }
}
```

**Errors**:
- `401 UNAUTHORIZED` - Missing/invalid token

---

#### PUT `/api/auth/profile`
Update user profile.

**Headers**: `Authorization: Bearer <token>`

**Request** (all fields optional):
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "address": "123, MG Road, Hyderabad"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "user": { /* Updated user object */ }
}
```

**Validation**:
- `name`: min 2 characters
- `email`: valid email format

---

### 3.2 Categories

#### GET `/api/categories`
Get all categories as hierarchical tree.

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "cat-electronics",
      "name": "Electronics",
      "slug": "electronics",
      "parentId": null,
      "level": 0,
      "path": "electronics",
      "displayOrder": 1,
      "status": "ACTIVE",
      "productCount": 8,
      "children": [
        {
          "id": "cat-mixer-grinder",
          "name": "Mixer Grinder",
          "level": 1,
          "children": [ /* Level 2 */ ]
        }
      ]
    }
  ]
}
```

**Notes**:
- Returns nested tree structure
- Max 3 levels (0, 1, 2)
- Only return ACTIVE categories for regular users

---

#### GET `/api/categories/{slug}`
Get single category with subcategories and breadcrumb.

**Success Response** (200):
```json
{
  "success": true,
  "data": { /* Category object */ },
  "subcategories": [ /* Direct children only */ ],
  "breadcrumb": [
    { "name": "Home", "slug": "/" },
    { "name": "Electronics", "slug": "electronics" },
    { "name": "Mixer Grinder", "slug": "mixer-grinder" }
  ]
}
```

**Errors**:
- `404 NOT_FOUND` - Category not found

---

### 3.3 Products

#### GET `/api/products`
List/search products with filters and pagination.

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 30 | Items per page (max 100) |
| `search` | string | - | Search query |
| `categoryId` | string | - | Filter by category (includes children) |
| `brandId` | string | - | Filter by brand |
| `featured` | boolean | - | Only featured products |
| `sort` | string | relevance | Sort order |

**Sort Options**:
- `relevance` - Featured first, then by rating
- `price_asc` - Price low to high
- `price_desc` - Price high to low
- `rating` - Highest rated first
- `discount` - Highest discount first
- `newest` - Newest first

**Success Response** (200):
```json
{
  "success": true,
  "data": [ /* ProductListItem[] */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 120,
    "itemsPerPage": 30,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Important**:
- Returns default variant for each product group
- Category filter should include products from child categories
- Search should match name, brand name, and category name

---

#### GET `/api/products/{slug}`
Get complete product details with all variants.

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "pg-prestige-mixer-iris",
    "name": "Prestige Iris Mixer Grinder",
    "slug": "prestige-iris-mixer-grinder",
    "description": "...",
    "brand": { "id": "...", "name": "Prestige", "slug": "prestige" },
    "category": {
      "id": "cat-mixer-grinder",
      "name": "Mixer Grinder",
      "slug": "mixer-grinder",
      "path": "electronics/mixer-grinder",
      "breadcrumb": [ /* ... */ ]
    },
    "variants": [
      {
        "id": "prod-prestige-iris-750w-3jar",
        "slug": "750w-3-jar",
        "name": "750W - 3 Jar",
        "sku": "PRES-IRIS-750-3J",
        "mrp": 5995,
        "sellingPrice": 4499,
        "discountPercentage": 25,
        "stockQuantity": 15,
        "isDefaultVariant": true,
        "status": "ACTIVE",
        "attributes": {
          "Power": "750W",
          "Jars": "3",
          "Color": "White & Blue",
          "Warranty": "2 Years"
        },
        "images": [ /* ProductImage[] */ ]
      }
    ],
    "images": [ /* All images across variants */ ],
    "averageRating": 4.5,
    "totalReviews": 128,
    "isFeatured": true,
    "status": "ACTIVE"
  }
}
```

**Errors**:
- `404 PRODUCT_NOT_FOUND` - Product not found

---

### 3.4 Brands

#### GET `/api/brands`
Get all active brands.

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "brand-prestige",
      "name": "Prestige",
      "slug": "prestige",
      "logoUrl": "https://...",
      "description": "India's most trusted kitchen appliance brand",
      "status": "ACTIVE",
      "productCount": 6
    }
  ]
}
```

---

### 3.5 Banners

#### GET `/api/banners`
Get active homepage banners.

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "banner-1",
      "title": "Wide Range of Home Appliances",
      "imageUrlDesktop": "https://...",
      "imageUrlMobile": "https://...",
      "linkType": "CATEGORY",
      "linkValue": "electronics",
      "displayOrder": 1,
      "status": "ACTIVE"
    }
  ]
}
```

**Notes**:
- Return only `status: "ACTIVE"` banners
- Sort by `displayOrder` ascending

---

### 3.6 Wishlist

#### GET `/api/wishlist`
Get user's wishlist with enriched product details.

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "wishlist-item-1",
      "userId": "user-1",
      "productGroupId": "pg-prestige-mixer-iris",
      "variantId": "prod-prestige-iris-750w-3jar",
      "addedAt": "2026-01-15T10:30:00Z",
      "product": { /* ProductListItem */ }
    }
  ],
  "totalItems": 5
}
```

---

#### POST `/api/wishlist`
Add product to wishlist.

**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "productGroupId": "pg-prestige-mixer-iris",
  "variantId": "prod-prestige-iris-750w-3jar"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Added to wishlist",
  "data": { /* WishlistItem */ }
}
```

**Errors**:
- `409 ALREADY_IN_WISHLIST` - Already exists
- `404 PRODUCT_NOT_FOUND` - Invalid product/variant

---

#### DELETE `/api/wishlist/{id}`
Remove item from wishlist.

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Removed from wishlist"
}
```

---

## 4. Database Schema Reference

### Core Entities

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │    categories   │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ phone (unique)  │       │ name            │
│ name            │       │ slug (unique)   │
│ email           │       │ parent_id (FK)  │
│ address         │       │ level           │
│ role            │       │ path            │
│ created_at      │       │ display_order   │
│ updated_at      │       │ status          │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│     brands      │       │ product_groups  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ name            │       │ name            │
│ slug (unique)   │       │ slug (unique)   │
│ logo_url        │       │ description     │
│ description     │       │ category_id(FK) │
│ status          │       │ brand_id (FK)   │
└─────────────────┘       │ avg_rating      │
                          │ total_reviews   │
┌─────────────────┐       │ is_featured     │
│    products     │       │ status          │
│   (variants)    │       └─────────────────┘
├─────────────────┤
│ id (PK)         │       ┌─────────────────┐
│ product_group_id│───────│ product_images  │
│ sku (unique)    │       ├─────────────────┤
│ slug            │       │ id (PK)         │
│ name            │       │ product_id (FK) │
│ mrp             │       │ url             │
│ selling_price   │       │ alt_text        │
│ discount_pct    │       │ display_order   │
│ stock_quantity  │       │ is_primary      │
│ is_default      │       └─────────────────┘
│ status          │
│ attributes(JSON)│       ┌─────────────────┐
└─────────────────┘       │    wishlist     │
                          ├─────────────────┤
┌─────────────────┐       │ id (PK)         │
│    banners      │       │ user_id (FK)    │
├─────────────────┤       │ product_group_id│
│ id (PK)         │       │ variant_id (FK) │
│ title           │       │ added_at        │
│ image_desktop   │       └─────────────────┘
│ image_mobile    │
│ link_type       │
│ link_value      │
│ display_order   │
│ status          │
└─────────────────┘
```

### Key Relationships
- `categories.parent_id` → `categories.id` (self-referential)
- `product_groups.category_id` → `categories.id`
- `product_groups.brand_id` → `brands.id`
- `products.product_group_id` → `product_groups.id`
- `product_images.product_id` → `products.id`
- `wishlist.user_id` → `users.id`
- `wishlist.variant_id` → `products.id`

---

## 5. Important Implementation Notes

### 5.1 Product Architecture
Products follow a two-level structure:
- **ProductGroup**: Parent entity (name, description, brand, category, rating)
- **Product (Variant)**: Child entity (SKU, prices, attributes, stock)

For list views, return one item per ProductGroup (default variant).
For detail view, return all variants.

### 5.2 Category Filtering
When filtering by category:
- Include products from the selected category AND all child categories
- Example: Filtering by "Electronics" returns products from "Electronics", "Mixer Grinder", "3 Jar", etc.

### 5.3 Search Behavior
Search should match:
- Product name
- Brand name  
- Category name

Case-insensitive matching.

### 5.4 Image URLs
- Products use placeholder images in mock (placehold.co)
- Real backend should serve from S3/CDN
- Provide both desktop and mobile banner images

### 5.5 Pagination
- Default: 30 items per page (configurable via `NEXT_PUBLIC_PRODUCTS_PER_PAGE`)
- Max limit: 100
- UI uses infinite scroll with Intersection Observer

### 5.6 Admin Detection
- Phone `+919849067667` → `role: "ADMIN"`
- All other phones → `role: "USER"`

---

## 6. Not Yet Implemented (Future APIs)

The following are planned but not yet consumed by the UI:

| Endpoint | Purpose | Phase |
|----------|---------|-------|
| `GET /api/products/{id}/related` | Related products | 2 |
| `POST /api/products/{id}/views` | Track product views | 2 |
| Price range filter | `minPrice`, `maxPrice` params | 2 |
| Admin CRUD endpoints | Category/Product/Brand management | 2 |
| Order management | Cart, checkout, orders | 2 |

---

## 7. Testing the APIs

### Sample cURL Commands

```bash
# Get all categories
curl http://localhost:3000/api/categories

# Get products with filters
curl "http://localhost:3000/api/products?categoryId=cat-mixer-grinder&sort=price_asc&limit=10"

# Search products
curl "http://localhost:3000/api/products?search=prestige"

# Get product details
curl http://localhost:3000/api/products/prestige-iris-mixer-grinder

# Login (send OTP)
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'

# Get wishlist (with auth)
curl http://localhost:3000/api/wishlist \
  -H "Authorization: Bearer <token>"
```

---

## 8. Contact

For questions about UI requirements or API contracts, refer to:
- [05_api_requirements.md](specs/05_api_requirements.md) - Full API documentation
- [types/index.ts](store/src/types/index.ts) - TypeScript interfaces
- Mock API routes in `store/src/app/api/` for reference implementations
