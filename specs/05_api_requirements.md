Complete API contracts and mock data specifications - reference this when implementing API integration and creating mock responses.

**Last Updated**: 2026-01-22 (Updated to reflect Phase 1 implementation through Step 9)

---

# API REQUIREMENTS

## How to Use This Document

This document provides:
- Complete API endpoint specifications (for backend team)
- Request/response schemas with examples
- Mock data structure for Phase 1 development
- Error handling patterns
- Authentication requirements

**Implementation Status**: ✅ Implemented | ⬜ Not Started

---

# API ARCHITECTURE (IMPLEMENTED)

## Base URL

**Phase 1 (Mock APIs)** - Currently Active:
```
http://localhost:3000/api
```

**Phase 2 (Real Backend)** - Future:
```
https://api.newguruenterprises.com/v1
```

**Environment Variable**: `NEXT_PUBLIC_API_URL` (defaults to `/api`)

## Authentication (IMPLEMENTED)

**Method**: Mock JWT (Base64 JSON token)

**Token Storage** (Implemented):
- **localStorage** for Phase 1 simplicity
- Will migrate to httpOnly cookies for production

**Auth Flow** (Implemented):
1. User sends OTP request → Mock always succeeds, logs OTP to console
2. User verifies OTP → Any 6-digit OTP accepted, returns mock user + token
3. Frontend stores token in localStorage
4. Subsequent requests include token in Authorization header

**Auth Header**:
```http
Authorization: Bearer <base64_token>
```

**Token Format** (Mock): Base64-encoded JSON with userId + timestamp
**Token Expiry**: 30 days

---

# IMPLEMENTED ENDPOINTS SUMMARY

| Route | Method | Purpose | Status |
|-------|--------|---------|--------|
| `/api/auth/send-otp` | POST | Send OTP (mock) | ✅ |
| `/api/auth/verify-otp` | POST | Verify OTP, return token | ✅ |
| `/api/auth/me` | GET | Get current user | ✅ |
| `/api/auth/logout` | POST | Logout | ✅ |
| `/api/auth/profile` | PUT | Update user profile | ✅ |
| `/api/categories` | GET | Get all categories (tree) | ✅ |
| `/api/categories/[slug]` | GET | Single category + breadcrumb | ✅ |
| `/api/products` | GET | List products (search, filters, sort) | ✅ |
| `/api/products/[slug]` | GET | Product details with variants | ✅ |
| `/api/brands` | GET | List all brands | ✅ |
| `/api/banners` | GET | Active banners | ✅ |
| `/api/wishlist` | GET/POST/DELETE | Wishlist operations | ✅ |

---

# USER-FACING ENDPOINTS

## 1. AUTHENTICATION APIs ✅

### 1.1 Send OTP ✅

**Endpoint**: `POST /api/auth/send-otp`

**Purpose**: Send OTP to user's phone number for login/registration

**Request Body**:
```json
{
  "phone": "+919876543210"
}
```

**Validation**:
- Phone: Required, valid format

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully to +919876543210",
  "expiresIn": 300  // Seconds (5 minutes)
}
```

**Error Responses**:
```json
// 400 - Invalid phone number
{
  "success": false,
  "error": "INVALID_PHONE",
  "message": "Please provide a valid phone number"
}

// 429 - Too many requests
{
  "success": false,
  "error": "TOO_MANY_REQUESTS",
  "message": "Too many OTP requests. Please try again after 60 seconds",
  "retryAfter": 60
}

// 500 - Server error
{
  "success": false,
  "error": "OTP_SEND_FAILED",
  "message": "Failed to send OTP. Please try again"
}
```

**Mock Implementation**:
- Always return success
- Log OTP to console for testing: `console.log('OTP for ${phone}: 123456')`

---

### 1.2 Verify OTP

**Endpoint**: `POST /api/auth/verify-otp`

**Purpose**: Verify OTP and return JWT token

**Request Body**:
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "99999999-9999-9999-9999-999999999999",
    "phone": "+919876543210",
    "name": "Rajesh Kumar",  // null if first-time user
    "email": "rajesh@example.com",
    "role": "USER",  // or "ADMIN"
    "createdAt": "2025-12-01T10:30:00Z"
  },
  "isNewUser": false  // true if this is first login
}
```

**Error Responses**:
```json
// 400 - Invalid OTP
{
  "success": false,
  "error": "INVALID_OTP",
  "message": "Invalid OTP. Please try again"
}

// 410 - Expired OTP
{
  "success": false,
  "error": "OTP_EXPIRED",
  "message": "OTP has expired. Please request a new one"
}

// 404 - OTP not found
{
  "success": false,
  "error": "OTP_NOT_FOUND",
  "message": "No OTP request found for this phone number"
}
```

**Mock Implementation**:
- Accept any 6-digit OTP
- Return mock user data
- Generate fake JWT token

---

### 1.3 Get Current User

**Endpoint**: `GET /api/auth/me`

**Purpose**: Get current logged-in user details

**Headers**: `Authorization: Bearer <token>` (Required)

**Success Response** (200):
```json
{
  "success": true,
  "user": {
    "id": "99999999-9999-9999-9999-999999999999",
    "phone": "+919876543210",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "address": "123, MG Road, Hyderabad",
    "role": "USER",
    "isVerified": true,
    "createdAt": "2025-12-01T10:30:00Z",
    "updatedAt": "2025-12-15T14:20:00Z"
  }
}
```

**Error Responses**:
```json
// 401 - Unauthorized
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

---

### 1.4 Update User Profile

**Endpoint**: `PUT /api/user/profile`

**Purpose**: Update user name, email, address

**Headers**: `Authorization: Bearer <token>` (Required)

**Request Body**:
```json
{
  "name": "Rajesh Kumar",  // Optional
  "email": "newemail@example.com",  // Optional
  "address": "456, New Address, Hyderabad"  // Optional
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "99999999-9999-9999-9999-999999999999",
    "phone": "+919876543210",
    "name": "Rajesh Kumar",
    "email": "newemail@example.com",
    "address": "456, New Address, Hyderabad",
    "role": "USER",
    "updatedAt": "2025-12-16T10:00:00Z"
  }
}
```

---

### 1.5 Logout

**Endpoint**: `POST /api/auth/logout`

**Purpose**: Invalidate current session token

**Headers**: `Authorization: Bearer <token>` (Required)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Frontend Action**: Clear stored token from cookies/localStorage

---

## 2. CATEGORY APIs

### 2.1 Get All Categories

**Endpoint**: `GET /api/categories`

**Purpose**: Get hierarchical category tree

**Query Parameters**:
- `includeInactive` (optional, boolean): Include inactive categories (admin only)

**Success Response** (200):
```json
{
  "success": true,
  "categories": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Electronics",
      "slug": "electronics",
      "description": "All electronic appliances",
      "imageUrl": "https://s3.example.com/categories/electronics.jpg",
      "parentId": null,
      "level": 0,
      "path": "/electronics/",
      "displayOrder": 1,
      "isActive": true,
      "productCount": 25,
      "children": [
        {
          "id": "33333333-3333-3333-3333-333333333333",
          "name": "Mixer Grinder",
          "slug": "mixer-grinder",
          "imageUrl": "https://s3.example.com/categories/mixer-grinder.jpg",
          "parentId": "11111111-1111-1111-1111-111111111111",
          "level": 1,
          "path": "/electronics/mixer-grinder/",
          "displayOrder": 1,
          "isActive": true,
          "productCount": 15,
          "children": [
            {
              "id": "55555555-5555-5555-5555-555555555555",
              "name": "3 Jar",
              "slug": "3-jar",
              "imageUrl": null,
              "parentId": "33333333-3333-3333-3333-333333333333",
              "level": 2,
              "path": "/electronics/mixer-grinder/3-jar/",
              "displayOrder": 1,
              "isActive": true,
              "productCount": 8,
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "22222222-2222-2222-2222-222222222222",
      "name": "Kitchen Essentials",
      "slug": "kitchen-essentials",
      "description": "Essential kitchen items",
      "imageUrl": "https://s3.example.com/categories/kitchen.jpg",
      "parentId": null,
      "level": 0,
      "path": "/kitchen-essentials/",
      "displayOrder": 2,
      "isActive": true,
      "productCount": 30,
      "children": [...]
    }
  ]
}
```

**Notes**:
- Returns nested structure with all levels
- Only active categories for regular users
- Product count includes products in child categories

---

### 2.2 Get Category by Slug/ID

**Endpoint**: `GET /api/categories/{slugOrId}`

**Purpose**: Get single category details with immediate children

**Success Response** (200):
```json
{
  "success": true,
  "category": {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Electronics",
    "slug": "electronics",
    "description": "All electronic appliances",
    "imageUrl": "https://s3.example.com/categories/electronics.jpg",
    "parentId": null,
    "level": 0,
    "path": "/electronics/",
    "displayOrder": 1,
    "isActive": true,
    "productCount": 25
  },
  "subcategories": [
    {
      "id": "33333333-3333-3333-3333-333333333333",
      "name": "Mixer Grinder",
      "slug": "mixer-grinder",
      "imageUrl": "https://s3.example.com/categories/mixer-grinder.jpg",
      "level": 1,
      "productCount": 15
    }
  ],
  "breadcrumb": [
    { "name": "Home", "slug": "/" },
    { "name": "Electronics", "slug": "electronics" }
  ]
}
```

---

### 2.3 Get Products by Category

**Endpoint**: `GET /api/categories/{slugOrId}/products`

**Purpose**: Get all products in a category (including child categories)

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 24, max: 100)
- `includeChildren` (boolean, default: true): Include products from subcategories

**Success Response** (200):
```json
{
  "success": true,
  "products": [
    {
      "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
      "name": "Prestige Deluxe Alpha Pressure Cooker",
      "slug": "prestige-deluxe-alpha-pressure-cooker",
      "description": "Premium stainless steel pressure cooker...",
      "brand": {
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "name": "Prestige",
        "slug": "prestige"
      },
      "category": {
        "id": "44444444-4444-4444-4444-444444444444",
        "name": "Pressure Cooker",
        "path": "/kitchen-essentials/pressure-cooker/"
      },
      "basePrice": 2500.00,
      "defaultVariant": {
        "id": "12121212-1212-1212-1212-121212121212",
        "variantName": "2 Litre",
        "sku": "PRE-DLX-ALP-2L",
        "mrp": 3000.00,
        "sellingPrice": 2500.00,
        "discountPercentage": 16.67
      },
      "images": [
        {
          "id": "img1",
          "url": "https://s3.example.com/products/prestige-cooker-1.jpg",
          "isPrimary": true
        }
      ],
      "rating": 4.5,
      "reviewCount": 120,
      "isFeatured": true,
      "status": "ACTIVE",
      "variantCount": 3
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalProducts": 65,
    "limit": 24,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 3. PRODUCT APIs

### 3.1 Get Products (Search/Browse)

**Endpoint**: `GET /api/products`

**Purpose**: Search and filter products

**Query Parameters**:
- `search` (string): Search query
- `categoryId` (UUID): Filter by category
- `brandId` (UUID): Filter by brand
- `minPrice` (number): Minimum price filter (Phase 2)
- `maxPrice` (number): Maximum price filter (Phase 2)
- `sortBy` (string): `price_asc`, `price_desc`, `newest`, `popular` (Phase 2)
- `page` (number, default: 1)
- `limit` (number, default: 24)

**Success Response** (200):
```json
{
  "success": true,
  "products": [...], // Same structure as category products
  "pagination": {...},
  "filters": {  // Available filter options (Phase 2)
    "brands": [
      { "id": "...", "name": "Prestige", "count": 12 },
      { "id": "...", "name": "Bajaj", "count": 8 }
    ],
    "priceRange": { "min": 500, "max": 15000 }
  }
}
```

---

### 3.2 Get Product Details

**Endpoint**: `GET /api/products/{slugOrId}`

**Purpose**: Get complete product details with all variants

**Success Response** (200):
```json
{
  "success": true,
  "product": {
    "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
    "name": "Prestige Deluxe Alpha Pressure Cooker",
    "slug": "prestige-deluxe-alpha-pressure-cooker",
    "description": "Premium stainless steel pressure cooker with safety features. Suitable for all types of cooking including dal, rice, meat, and vegetables.",
    "brand": {
      "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "name": "Prestige",
      "slug": "prestige",
      "description": "Premium kitchen appliances brand"
    },
    "category": {
      "id": "44444444-4444-4444-4444-444444444444",
      "name": "Pressure Cooker",
      "slug": "pressure-cooker",
      "path": "/kitchen-essentials/pressure-cooker/",
      "breadcrumb": [
        { "name": "Home", "slug": "/" },
        { "name": "Kitchen Essentials", "slug": "kitchen-essentials" },
        { "name": "Pressure Cooker", "slug": "pressure-cooker" }
      ]
    },
    "basePrice": 2500.00,
    "searchKeywords": "cooker kitchen pressure stainless steel cooking",
    "variants": [
      {
        "id": "12121212-1212-1212-1212-121212121212",
        "variantName": "2 Litre",
        "sku": "PRE-DLX-ALP-2L",
        "mrp": 3000.00,
        "sellingPrice": 2500.00,
        "discountPercentage": 16.67,
        "stockQuantity": 25,  // Phase 2
        "attributes": {
          "size": "2L",
          "material": "Stainless Steel",
          "warranty": "5 years"
        },
        "isDefault": true,
        "status": "ACTIVE"
      },
      {
        "id": "13131313-1313-1313-1313-131313131313",
        "variantName": "3 Litre",
        "sku": "PRE-DLX-ALP-3L",
        "mrp": 3500.00,
        "sellingPrice": 2900.00,
        "discountPercentage": 17.14,
        "stockQuantity": 18,
        "attributes": {
          "size": "3L",
          "material": "Stainless Steel",
          "warranty": "5 years"
        },
        "isDefault": false,
        "status": "ACTIVE"
      },
      {
        "id": "14141414-1414-1414-1414-141414141414",
        "variantName": "5 Litre",
        "sku": "PRE-DLX-ALP-5L",
        "mrp": 4500.00,
        "sellingPrice": 3800.00,
        "discountPercentage": 15.56,
        "stockQuantity": 10,
        "attributes": {
          "size": "5L",
          "material": "Stainless Steel",
          "warranty": "5 years"
        },
        "isDefault": false,
        "status": "ACTIVE"
      }
    ],
    "images": [
      {
        "id": "img1",
        "productId": "12121212-1212-1212-1212-121212121212",
        "url": "https://s3.example.com/products/prestige-cooker-2l-1.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "id": "img2",
        "productId": "12121212-1212-1212-1212-121212121212",
        "url": "https://s3.example.com/products/prestige-cooker-2l-2.jpg",
        "isPrimary": false,
        "displayOrder": 2
      }
    ],
    "rating": 4.5,
    "reviewCount": 120,
    "isFeatured": true,
    "status": "ACTIVE",
    "createdAt": "2025-11-01T10:00:00Z",
    "updatedAt": "2025-12-15T14:30:00Z"
  }
}
```

**Error Response**:
```json
// 404 - Product not found
{
  "success": false,
  "error": "PRODUCT_NOT_FOUND",
  "message": "Product not found"
}
```

---

### 3.3 Get Related Products

**Endpoint**: `GET /api/products/{id}/related`

**Purpose**: Get similar products for recommendations

**Query Parameters**:
- `limit` (number, default: 6)

**Success Response** (200):
```json
{
  "success": true,
  "products": [...]  // Same structure as product list, max 6 items
}
```

**Backend Logic** (Phase 1):
- Return products from same category (excluding current product)
- OR products from same brand
- Random order or sorted by popularity

**Phase 2**: AI-based recommendations using product views, user history

---

### 3.4 Track Product View

**Endpoint**: `POST /api/products/{id}/views`

**Purpose**: Track product page views for analytics

**Headers**: `Authorization: Bearer <token>` (Optional - track even for anonymous)

**Request Body**: None (empty)

**Success Response** (200):
```json
{
  "success": true,
  "message": "View tracked"
}
```

**Backend Implementation**:
- Increment view count in product_views table
- Use for analytics (most viewed products)
- Phase 1: Simple increment
- Phase 2: Track unique views, time on page, etc.

---

## 4. BRAND APIs

### 4.1 Get All Brands

**Endpoint**: `GET /api/brands`

**Purpose**: Get all active brands

**Success Response** (200):
```json
{
  "success": true,
  "brands": [
    {
      "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "name": "Prestige",
      "slug": "prestige",
      "description": "Premium kitchen appliances brand",
      "logoUrl": "https://s3.example.com/brands/prestige-logo.png",
      "productCount": 25
    },
    {
      "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "name": "Bajaj",
      "slug": "bajaj",
      "description": "Trusted Indian electronics brand",
      "logoUrl": "https://s3.example.com/brands/bajaj-logo.png",
      "productCount": 18
    }
  ]
}
```

---

## 5. BANNER APIs

### 5.1 Get Active Banners

**Endpoint**: `GET /api/banners`

**Purpose**: Get all active homepage banners

**Success Response** (200):
```json
{
  "success": true,
  "banners": [
    {
      "id": "banner1",
      "title": "Prestige Brand Sale 2025",
      "imageUrl": "https://s3.example.com/banners/prestige-sale.jpg",
      "mobileImageUrl": "https://s3.example.com/banners/prestige-sale-mobile.jpg",
      "clickAction": {
        "type": "brand",  // "category", "brand", "collection", "url"
        "target": "prestige",  // brand slug
        "url": "/products?brand=prestige"  // Computed URL
      },
      "displayOrder": 1,
      "isActive": true
    },
    {
      "id": "banner2",
      "title": "Mixer Grinder Collection",
      "imageUrl": "https://s3.example.com/banners/mixer-grinder.jpg",
      "mobileImageUrl": "https://s3.example.com/banners/mixer-grinder-mobile.jpg",
      "clickAction": {
        "type": "category",
        "target": "mixer-grinder",
        "url": "/category/mixer-grinder/products"
      },
      "displayOrder": 2,
      "isActive": true
    }
  ]
}
```

---

## 6. WISHLIST APIs

### 6.1 Get User Wishlist

**Endpoint**: `GET /api/wishlist`

**Purpose**: Get all items in user's wishlist

**Headers**: `Authorization: Bearer <token>` (Required)

**Success Response** (200):
```json
{
  "success": true,
  "wishlist": [
    {
      "id": "wishlist-item-1",
      "productGroupId": "dddddddd-dddd-dddd-dddd-dddddddddddd",
      "variantId": "13131313-1313-1313-1313-131313131313",
      "product": {
        "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
        "name": "Prestige Deluxe Alpha Pressure Cooker",
        "slug": "prestige-deluxe-alpha-pressure-cooker",
        "brand": {
          "name": "Prestige"
        },
        "variant": {
          "id": "13131313-1313-1313-1313-131313131313",
          "variantName": "3 Litre",
          "mrp": 3500.00,
          "sellingPrice": 2900.00,
          "discountPercentage": 17.14,
          "status": "ACTIVE"
        },
        "primaryImage": {
          "url": "https://s3.example.com/products/prestige-cooker-3l-1.jpg"
        }
      },
      "addedAt": "2025-12-15T10:30:00Z"
    }
  ],
  "totalItems": 1
}
```

---

### 6.2 Add to Wishlist

**Endpoint**: `POST /api/wishlist`

**Purpose**: Add product variant to wishlist

**Headers**: `Authorization: Bearer <token>` (Required)

**Request Body**:
```json
{
  "productGroupId": "dddddddd-dddd-dddd-dddd-dddddddddddd",
  "variantId": "13131313-1313-1313-1313-131313131313"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "wishlistItem": {
    "id": "wishlist-item-1",
    "productGroupId": "dddddddd-dddd-dddd-dddd-dddddddddddd",
    "variantId": "13131313-1313-1313-1313-131313131313",
    "addedAt": "2025-12-16T11:00:00Z"
  }
}
```

**Error Responses**:
```json
// 409 - Already in wishlist
{
  "success": false,
  "error": "ALREADY_IN_WISHLIST",
  "message": "This product is already in your wishlist"
}

// 404 - Product not found
{
  "success": false,
  "error": "PRODUCT_NOT_FOUND",
  "message": "Product or variant not found"
}
```

---

### 6.3 Remove from Wishlist

**Endpoint**: `DELETE /api/wishlist/{itemId}`

**Purpose**: Remove item from wishlist

**Headers**: `Authorization: Bearer <token>` (Required)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

---

# ADMIN-ONLY ENDPOINTS

**Authentication**: All admin endpoints require JWT token with `role: "ADMIN"`

**Authorization Check**:
```json
// 403 - Forbidden (non-admin user)
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "Admin access required"
}
```

---

## 7. ADMIN - ANALYTICS APIs

### 7.1 Get Dashboard Stats

**Endpoint**: `GET /api/admin/analytics/dashboard`

**Purpose**: Get summary statistics for admin dashboard

**Success Response** (200):
```json
{
  "success": true,
  "stats": {
    "totalProducts": 87,
    "totalCategories": 15,
    "totalUsers": 342,
    "totalWishlistItems": 156,
    "topViewedProducts": [
      {
        "productId": "dddddddd-dddd-dddd-dddd-dddddddddddd",
        "productName": "Prestige Deluxe Alpha 3L",
        "viewCount": 1234,
        "lastViewedAt": "2025-12-16T10:30:00Z"
      }
    ],
    "recentProducts": [
      {
        "id": "...",
        "name": "Bajaj Rex Mixer",
        "createdAt": "2025-12-15T14:00:00Z"
      }
    ],
    "recentUsers": [
      {
        "id": "...",
        "name": "John Doe",
        "phone": "+919876543210",
        "createdAt": "2025-12-16T09:00:00Z"
      }
    ]
  }
}
```

---

## 8. ADMIN - PRODUCT MANAGEMENT APIs

### 8.1 Get All Products (Admin)

**Endpoint**: `GET /api/admin/products`

**Purpose**: Get all products including drafts and archived

**Query Parameters**:
- `status` (string): Filter by status (ACTIVE, DRAFT, ARCHIVED)
- `categoryId` (UUID): Filter by category
- `brandId` (UUID): Filter by brand
- `search` (string): Search by name or SKU
- `page`, `limit`

**Success Response**: Similar to user product list but includes all statuses

---

### 8.2 Create Product

**Endpoint**: `POST /api/admin/products`

**Purpose**: Create new product with variants and images

**Request Body**:
```json
{
  "name": "Bajaj Rex Mixer Grinder 750W",
  "slug": "bajaj-rex-mixer-grinder-750w",  // Auto-generated if not provided
  "description": "Powerful 750W mixer grinder with 3 jars",
  "brandId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "categoryId": "55555555-5555-5555-5555-555555555555",
  "basePrice": 3200.00,
  "searchKeywords": "mixer, grinder, bajaj, 750w, kitchen",
  "status": "ACTIVE",  // or "DRAFT"
  "isFeatured": true,
  "variants": [
    {
      "variantName": "Standard",
      "sku": "BAJ-REX-750W",
      "mrp": 4000.00,
      "sellingPrice": 3200.00,
      "stockQuantity": 50,
      "attributes": {
        "power": "750W",
        "jars": "3",
        "warranty": "2 years"
      },
      "isDefault": true,
      "status": "ACTIVE"
    }
  ],
  "images": [
    {
      "url": "https://s3.example.com/products/bajaj-rex-1.jpg",
      "isPrimary": true,
      "displayOrder": 1
    },
    {
      "url": "https://s3.example.com/products/bajaj-rex-2.jpg",
      "isPrimary": false,
      "displayOrder": 2
    }
  ]
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    "name": "Bajaj Rex Mixer Grinder 750W",
    "slug": "bajaj-rex-mixer-grinder-750w",
    ...
  }
}
```

**Validation Errors** (400):
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "variants[0].sku",
      "message": "SKU already exists"
    },
    {
      "field": "variants[0].sellingPrice",
      "message": "Selling price cannot exceed MRP"
    }
  ]
}
```

---

### 8.3 Update Product

**Endpoint**: `PUT /api/admin/products/{id}`

**Purpose**: Update existing product

**Request Body**: Same as create product

**Success Response** (200):
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {...}
}
```

---

### 8.4 Delete Product

**Endpoint**: `DELETE /api/admin/products/{id}`

**Purpose**: Soft delete product (change status to ARCHIVED)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Product archived successfully"
}
```

**Note**: Use PATCH to change status instead of hard delete

---

### 8.5 Update Product Price

**Endpoint**: `PATCH /api/admin/products/{productId}/variants/{variantId}/price`

**Purpose**: Quick price update for inline editing

**Request Body**:
```json
{
  "mrp": 3500.00,  // Optional
  "sellingPrice": 2800.00  // Optional
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Price updated successfully",
  "variant": {
    "id": "...",
    "mrp": 3500.00,
    "sellingPrice": 2800.00,
    "discountPercentage": 20.00
  }
}
```

---

## 9. ADMIN - CATEGORY MANAGEMENT APIs

### 9.1 Get All Categories (Admin)

**Endpoint**: `GET /api/admin/categories`

**Purpose**: Get all categories including inactive

**Success Response**: Same as user category list but includes inactive

---

### 9.2 Create Category

**Endpoint**: `POST /api/admin/categories`

**Request Body**:
```json
{
  "name": "4 Jar Mixer",
  "slug": "4-jar-mixer",  // Auto-generated if not provided
  "description": "Four jar mixer grinders",
  "parentId": "33333333-3333-3333-3333-333333333333",  // Optional
  "displayOrder": 2,
  "imageUrl": "https://s3.example.com/categories/4-jar.jpg",
  "isActive": true
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "id": "new-category-id",
    "name": "4 Jar Mixer",
    "slug": "4-jar-mixer",
    "level": 2,  // Auto-calculated
    "path": "/electronics/mixer-grinder/4-jar-mixer/",  // Auto-generated
    ...
  }
}
```

**Validation Errors**:
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "slug",
      "message": "Slug already exists"
    }
  ]
}

// Max depth exceeded
{
  "success": false,
  "error": "MAX_DEPTH_EXCEEDED",
  "message": "Cannot create category. Maximum hierarchy depth is 3 levels"
}
```

---

### 9.3 Update Category

**Endpoint**: `PUT /api/admin/categories/{id}`

**Request Body**: Same as create

**Success Response** (200)

---

### 9.4 Delete Category

**Endpoint**: `DELETE /api/admin/categories/{id}`

**Purpose**: Soft delete (set isActive = false)

**Success Response** (200)

---

## 10. ADMIN - BANNER MANAGEMENT APIs

### 10.1 Get All Banners (Admin)

**Endpoint**: `GET /api/admin/banners`

**Success Response**: All banners including inactive

---

### 10.2 Create Banner

**Endpoint**: `POST /api/admin/banners`

**Request Body**:
```json
{
  "title": "Prestige Brand Sale 2025",
  "imageUrl": "https://s3.example.com/banners/prestige-sale.jpg",
  "mobileImageUrl": "https://s3.example.com/banners/prestige-sale-mobile.jpg",
  "clickActionType": "brand",  // "category", "brand", "collection", "url"
  "clickActionTarget": "prestige",  // brand/category slug or URL
  "displayOrder": 1,
  "isActive": true
}
```

**Success Response** (201)

---

### 10.3 Update Banner

**Endpoint**: `PUT /api/admin/banners/{id}`

---

### 10.4 Delete Banner

**Endpoint**: `DELETE /api/admin/banners/{id}`

**Purpose**: Hard delete (banners are safe to delete)

---

## 11. ADMIN - BRAND MANAGEMENT APIs

### 11.1 Create Brand

**Endpoint**: `POST /api/admin/brands`

**Request Body**:
```json
{
  "name": "Hawkins",
  "slug": "hawkins",
  "description": "Trusted pressure cooker brand",
  "logoUrl": "https://s3.example.com/brands/hawkins.png"
}
```

---

## 12. FILE UPLOAD API

### 12.1 Upload Image to S3

**Endpoint**: `POST /api/upload`

**Purpose**: Upload image file to S3 and return URL

**Request**: `multipart/form-data`
```
File field: "image"
```

**Success Response** (200):
```json
{
  "success": true,
  "url": "https://s3.example.com/uploads/1234567890-image.jpg",
  "filename": "1234567890-image.jpg",
  "size": 245678,
  "mimeType": "image/jpeg"
}
```

**Validation**:
- File type: jpg, png, webp only
- Max size: 5MB
- Resize/optimize images before storing (backend responsibility)

---

# MOCK DATA STRUCTURE

## Mock Data Files (in `/mock_data` folder)

### File: `categories.json`
```json
{
  "categories": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Electronics",
      "slug": "electronics",
      "description": "All electronic appliances",
      "imageUrl": "/images/categories/electronics.jpg",
      "parentId": null,
      "level": 0,
      "path": "/electronics/",
      "displayOrder": 1,
      "isActive": true,
      "productCount": 25
    }
  ]
}
```

### File: `products.json`
```json
{
  "products": [
    {
      "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
      "name": "Prestige Deluxe Alpha Pressure Cooker",
      "slug": "prestige-deluxe-alpha-pressure-cooker",
      "description": "Premium stainless steel pressure cooker with safety features",
      "brandId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "categoryId": "44444444-4444-4444-4444-444444444444",
      "basePrice": 2500.00,
      "searchKeywords": "cooker kitchen pressure stainless steel cooking",
      "status": "ACTIVE",
      "isFeatured": true,
      "rating": 4.5,
      "reviewCount": 120,
      "createdAt": "2025-11-01T10:00:00Z"
    }
  ]
}
```

### File: `variants.json`
```json
{
  "variants": [
    {
      "id": "12121212-1212-1212-1212-121212121212",
      "productGroupId": "dddddddd-dddd-dddd-dddd-dddddddddddd",
      "variantName": "2 Litre",
      "sku": "PRE-DLX-ALP-2L",
      "mrp": 3000.00,
      "sellingPrice": 2500.00,
      "stockQuantity": 25,
      "attributes": {
        "size": "2L",
        "material": "Stainless Steel",
        "warranty": "5 years"
      },
      "isDefault": true,
      "status": "ACTIVE"
    }
  ]
}
```

### File: `brands.json`
### File: `banners.json`
### File: `users.json`

---

# ERROR HANDLING STANDARDS

## Standard Error Response Format

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "errors": [...]  // Optional, for validation errors
}
```

## HTTP Status Codes

- `200`: Success (GET, PUT, DELETE)
- `201`: Created (POST)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate SKU, already in wishlist)
- `429`: Too Many Requests (rate limiting)
- `500`: Internal Server Error

## Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Admin access required
- `NOT_FOUND`: Resource not found
- `ALREADY_EXISTS`: Duplicate entry (SKU, slug, etc.)
- `INVALID_TOKEN`: JWT token invalid or expired
- `RATE_LIMITED`: Too many requests

---

# FRONTEND IMPLEMENTATION GUIDELINES

## API Client Setup

**Recommended**: Use axios or fetch with interceptors

```typescript
// Example: axios setup
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);
```

## Data Fetching Strategy

**Phase 1**: Client-side fetching (SWR or React Query recommended)

```typescript
// Example: Using SWR
import useSWR from 'swr';

const fetcher = (url: string) => apiClient.get(url);

function ProductList() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher);
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ProductGrid products={data.products} />;
}
```

**Phase 2**: Server-side rendering for SEO
- Use Next.js `getServerSideProps` or `getStaticProps`
- Pre-render product pages
- Generate sitemap

## Caching Strategy

**Recommended**: SWR with revalidation

```typescript
const { data } = useSWR('/api/categories', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000 // 1 minute
});
```

**Cache Duration Recommendations**:
- Categories: 5 minutes (rarely change)
- Products: 1 minute (prices may change)
- User data: No cache (always fresh)
- Banners: 5 minutes

---

**End of API Requirements** - Use this document to implement API integration and create mock endpoints for Phase 1 development.
