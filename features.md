Comprehensive feature specifications for the online store application built with Next.js and React

---

# PROJECT OVERVIEW

**Business Context**: New Guru Enterprises - Home appliances and kitchenware catalog showcase
**Primary Goal**: Showcase wide variety of products available in store (catalog-first, not e-commerce focused)
**Target Users**: Mobile-first for customers, Desktop-first for admin
**Development Approach**: Phase 1 (Core Features) → Phase 2 (Advanced Features)

**Store Information**:
- Name: New Guru Enterprises
- Address: No. 5-4-726/1, Nampally Station Road ABIDS SOUTH Hyderabad, Telangana, 500001 India
- Phone: 9849067667
- Key Message: Wide Range of home appliances and kitchenware, Home delivery available

---

# PHASE 1 FEATURES (PRIORITY IMPLEMENTATION)

## 1. USER FEATURES - PHASE 1

### 1.1 Homepage
**Purpose**: Entry point showcasing products and categories

**Components**:
- **Hero Banner Section** (Top of page)
  - Carousel with multiple promotional banners
  - Each banner can link to:
    - Filtered product list (e.g., "40% off on Prestige brand")
    - Specific seasonal/special products collection
    - Featured product categories
  - Auto-rotate banners with manual navigation controls
  
- **Category Display Section**
  - Show main/parent categories as cards with images
  - Each category card shows:
    - Category image
    - Category name
    - Optional: Product count in category
  - Click behavior: Navigate to category drill-down view

- **Store Information Footer**
  - Display store name, address, phone number
  - "Home delivery available" message

### 1.2 Category Navigation & Drill-Down
**Purpose**: Hierarchical navigation through product categories (up to 3 levels)

**Behavior**:
- **Level 1 (Main Categories)**: E.g., "Electronics", "Kitchen Essentials"
  - Shown on homepage
  - Click → Navigate to category page showing subcategories OR products if no subcategories
  
- **Level 2 (Subcategories)**: E.g., "Mixer Grinder", "Pressure Cooker"
  - Shown on category page
  - Click → Navigate to next level OR show products
  
- **Level 3 (Sub-subcategories)**: E.g., "3 Jar", "Steel Base"
  - Final level, always shows products

**UI Pattern Consideration**:
- Option A: Click category name → Navigate to that category's page
- Option B: '+' icon next to category name → Expand to show subcategories inline; Click name → Show all products in that category and children
- **Decision Needed**: Implement Option A for Phase 1 (simpler), can add Option B in Phase 2

**Category Page Layout**:
- Breadcrumb navigation (e.g., Home > Electronics > Mixer Grinder)
- If has subcategories: Display subcategory cards
- If no subcategories OR user wants to see all products: Display product grid

### 1.3 Product Display (Tiles/Grid View)
**Purpose**: Show products in a browseable grid format

**Product Tile Components** (Each tile shows):
- Primary product image
- Product name (from product_groups.name)
- Brand name
- MRP (strikethrough if discounted)
- Selling price (highlighted)
- Discount percentage (e.g., "20% OFF") - calculated from MRP vs selling_price
- Rating stars (API-provided, display only in Phase 1)
- Optional badges: "Best Price", "Featured", etc.

**Grid Behavior**:
- Responsive grid: 2 columns on mobile, 3-4 on tablet, 4-6 on desktop
- Click on tile → Navigate to Product Detail Page

**Product Variants Handling**:
- Each variant (e.g., 2L, 3L, 5L pressure cooker) appears as separate tile in grid
- All variants link to same product detail page but with variant pre-selected

### 1.4 Product Detail Page
**Purpose**: Show complete information about a product and its variants

**Components**:
- **Image Gallery**
  - Primary image displayed large
  - Thumbnail strip below/side for multiple images
  - Click thumbnail → Change main image
  - Optional: Zoom on hover (Phase 2)

- **Product Information**
  - Product name (product_groups.name)
  - Brand name
  - Rating stars (display only for Phase 1)
  - MRP (strikethrough)
  - Selling price (large, highlighted)
  - Discount percentage badge
  - Product description (product_groups.description)
  - Attributes/specifications (from products.attributes JSON)
    - Display as key-value pairs (e.g., "Size: 2L", "Material: Stainless Steel", "Warranty: 5 years")

- **Variant Selector** (if product has multiple variants)
  - Display all variants for this product_group
  - Show as buttons/pills (e.g., "2L | 3L | 5L")
  - Each variant shows its price
  - Selecting variant updates: Image, Price, SKU, Attributes
  - Default: Show default_variant or first clicked variant

- **Action Buttons**
  - "Add to Wishlist" button (heart icon)
    - If not logged in → Redirect to login page with return URL
    - If logged in → Add to wishlist, show success message
  - For Phase 1: No "Add to Cart" (ordering not priority)

- **Additional Information Sections** (Expandable/Accordion style)
  - Specifications (detailed attributes)
  - Delivery Information (placeholder: "Available for home delivery")
  - Return Policy (static content)

- **Related Products Section** (Phase 1: Basic implementation)
  - Show 4-6 products from same category or brand
  - Simple carousel/grid
  - Phase 2: AI-based recommendations

### 1.5 Wishlist
**Purpose**: Allow users to save products for later viewing

**Access Control**:
- Guest users: Can browse, but clicking "Add to Wishlist" redirects to login
- Logged-in users: Can add/remove items from wishlist

**Wishlist Page Components**:
- Header: "My Wishlist" with item count
- Product grid (similar to product tiles)
- Each item shows:
  - Product image
  - Product name, brand
  - Current price (real-time from API)
  - "Remove from Wishlist" button
  - "View Details" button → Product detail page
- Empty state: "Your wishlist is empty" with browse categories CTA

**Backend Considerations**:
- Support for session-based wishlist (anonymous users) that merges on login
- API should return full product details for each wishlist item

### 1.6 User Authentication
**Purpose**: Phone-based OTP authentication for user login

**Login Flow**:
- **Step 1**: User clicks "Login" button (in header/navbar)
- **Step 2**: Login modal/page appears
  - Input: Phone number (+91 prefix)
  - Optional: Email input (stored but not used for auth)
  - "Send OTP" button
- **Step 3**: OTP sent via SMS (backend handles via OTP service)
  - 6-digit OTP input field
  - "Verify OTP" button
  - Resend OTP option (after 30 seconds)
- **Step 4**: On successful verification
  - Store user session/token
  - Redirect to original page (return URL) or homepage
  - Show "Welcome [User Name]" message

**User Profile** (Accessible after login):
- View/Edit: Name, Email, Address
- View only: Phone number (cannot edit, used for auth)
- Logout option

**Session Management**:
- JWT token or session-based auth
- Persist login across page refreshes
- Auto-logout after inactivity (configurable)

**No Order History in Phase 1** (placeholder only):
- Show "Orders" menu item but with "Coming soon" message

### 1.7 Search Functionality (Basic Implementation for Phase 1)
**Purpose**: Allow users to search products by name, brand, keywords

**Phase 1 Implementation** (Demo/Basic):
- Search bar in header
- Input search query → Call API with search term
- Display results in product grid format
- Simple text matching (backend uses trigram search from database)
- No advanced filters, no autocomplete

**Phase 2 Enhancements** (Mention only, no implementation):
- Autocomplete suggestions
- Search history
- Typo tolerance (fuzzy search)
- Category-specific search
- Voice search

### 1.8 Filters & Sorting (NOT Phase 1 - Mention for Future)
**Purpose**: Help users narrow down product results

**Phase 2 Implementation** (Document intent only):
- **Filters**:
  - Price range slider
  - Brand checkboxes
  - Rating filter
  - Availability (In Stock/Out of Stock)
  - Category filters
- **Sorting**:
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Popularity
  - Rating

**Phase 1**: No filters/sorting, just show products as returned by API

### 1.9 Ratings & Reviews (NOT Phase 1 - API Integration Only)
**Purpose**: Display product ratings and allow post-purchase reviews

**Phase 1**:
- Display star ratings on product tiles and detail pages (API-provided)
- Display review count (e.g., "4.5 ★ (120 reviews)")
- No review submission functionality

**Phase 2**:
- Review submission form (after order delivery)
- Display individual reviews with user names, dates
- Helpful/Not Helpful voting on reviews
- Admin moderation of reviews

---

## 2. ADMIN FEATURES - PHASE 1

### 2.1 Admin Access & Role-Based Routing
**Purpose**: Secure admin panel within same app

**Implementation**:
- Same Next.js app, different routes (e.g., `/admin/*`)
- After login, check user role (from users.role: 'ADMIN' or 'USER')
- If role = 'ADMIN': Show admin menu/dashboard
- If role = 'USER': Block access to admin routes, redirect to homepage
- Admin sidebar navigation with sections:
  - Dashboard (analytics)
  - Products Management
  - Categories Management
  - Banners Management
  - Orders (Phase 2)

**Desktop-First UI**:
- Admin panel optimized for desktop screens
- Responsive for tablet, limited mobile support (mobile can view but editing easier on desktop)

### 2.2 Product Management
**Purpose**: CRUD operations for products and variants

**Product List View**:
- Table/Grid showing all products (product_groups)
- Columns: Image, Name, Brand, Category, Base Price, Variants Count, Status, Actions
- Search/Filter by: Name, Brand, Category, Status
- Bulk actions: Delete, Change Status (if implementing bulk in Phase 1)
- "Add New Product" button

**Add/Edit Product Form** (Product Group Level):
- **Basic Information**:
  - Product Name (required)
  - Brand (dropdown from brands table)
  - Category (hierarchical dropdown - show Level 1 > Level 2 > Level 3)
  - Description (rich text editor or textarea)
  - Search Keywords (comma-separated tags)
  - Base Price (reference price)
  - Status: Active / Draft / Archived (dropdown)
  - Is Featured (checkbox)

- **Image Upload**:
  - Drag-and-drop or click to upload
  - Multiple images allowed (no limit for Phase 1)
  - Upload directly to S3 bucket
  - Set primary image (radio button selection)
  - Reorder images (drag-drop in Phase 2, order input in Phase 1)
  - Delete image button
  - Preview uploaded images

- **Variants Section**:
  - Add multiple variants for the product
  - Each variant has:
    - Variant Name (e.g., "2L", "Red Color", "Medium Size")
    - SKU (unique identifier, auto-generated or manual)
    - MRP (required, must be >= selling price)
    - Selling Price (required, must be <= MRP)
    - Attributes (JSON key-value pairs, e.g., {"size": "2L", "color": "Red"})
      - UI: Dynamic form with "Add Attribute" button
      - Input: Key field, Value field
    - Stock Quantity (not displayed to users in Phase 1, but stored)
    - Status: Active / Inactive
    - Is Default Variant (checkbox - only one can be default)
  - "Add Another Variant" button
  - Remove variant button

**Validation Rules**:
- Product name is required
- At least one variant must be added
- MRP must be greater than or equal to Selling Price
- SKU must be unique across all products
- Only one default variant per product group

**Save Behavior**:
- Save as Draft (status = DRAFT) or Publish (status = ACTIVE)
- Show success/error message
- Redirect to product list or stay on edit page (user choice)

**Delete Product**:
- Confirmation modal: "Are you sure you want to delete this product and all its variants?"
- Soft delete or hard delete (decision: soft delete - change status to ARCHIVED)

**Unlist Product**:
- Change status from ACTIVE to ARCHIVED (product no longer visible to users)
- Can relist by changing status back to ACTIVE

### 2.3 Category Management
**Purpose**: CRUD operations for categories (hierarchical structure)

**Category List View**:
- Tree/Hierarchical view showing parent-child relationships
- Or: Table view with columns: Image, Name, Parent Category, Level, Display Order, Status, Actions
- "Add New Category" button

**Add/Edit Category Form**:
- **Category Information**:
  - Category Name (required)
  - Slug (auto-generated from name or manual, must be unique)
  - Parent Category (dropdown, optional)
    - If no parent: Level 0 (main category)
    - If parent selected: Level = Parent's Level + 1
    - Max level: 2 (0, 1, 2 = 3 total levels)
  - Description (textarea)
  - Display Order (numeric, for sorting categories)
  - Status: Active / Inactive
  - Meta Title, Meta Description (for SEO, Phase 2)

- **Category Image**:
  - Upload single image
  - Drag-drop or click to upload
  - Upload to S3
  - Preview image
  - Replace/Delete image

**Validation Rules**:
- Category name is required
- Slug must be unique
- Cannot create category beyond Level 2 (prevent 4th level)
- Cannot set category as its own parent (prevent circular reference)

**Delete Category**:
- Confirmation: "Are you sure? This will also affect subcategories and products in this category."
- Option 1: Hard delete (delete category and reassign products to parent or uncategorized)
- Option 2: Soft delete (change status to INACTIVE)
- Phase 1: Implement soft delete

**Path Generation**:
- Auto-generate path field (e.g., "/electronics/mixer-grinder/3-jar/")
- Used for breadcrumbs and URL structure

### 2.4 Banner Management
**Purpose**: Manage promotional banners on homepage carousel

**Banner List View**:
- Table showing all banners
- Columns: Image Preview, Title, Click Action, Display Order, Status, Actions
- Drag-to-reorder (or numeric order input)
- "Add New Banner" button

**Add/Edit Banner Form**:
- **Banner Information**:
  - Title (internal reference, not displayed to users)
  - Banner Image (required)
    - Upload to S3
    - Recommended dimensions (e.g., 1920x600 for desktop, 800x400 for mobile)
    - Preview uploaded image
  - Click Action Type (radio buttons):
    - Option 1: Link to Category (dropdown to select category)
    - Option 2: Link to Brand (dropdown to select brand, shows all products of that brand)
    - Option 3: Link to Product List with Filters (e.g., "All products with >30% discount")
      - Custom filter configuration (Phase 2: advanced, Phase 1: just link to pre-defined product collection)
    - Option 4: External URL (input field)
  - Display Order (numeric)
  - Status: Active / Inactive
  - Start Date, End Date (optional, for scheduling banners - Phase 2)

**Delete Banner**:
- Confirmation modal
- Hard delete (remove from database)

### 2.5 Price Management
**Purpose**: Easy interface to update product prices in bulk or individually

**Quick Price Edit Interface**:
- **Option 1**: Inline editing in product list table
  - Click on price field → Edit in place
  - Update MRP and/or Selling Price
  - Auto-calculate discount percentage
  - Save with Enter key or Save button

- **Option 2**: Bulk Price Update
  - Select multiple products (checkboxes)
  - Apply action: "Update Prices"
  - Modal opens:
    - Increase/Decrease by percentage (e.g., +10%, -15%)
    - Or: Set fixed prices
  - Preview changes before applying
  - Confirm and save

**Validation**:
- Selling price cannot exceed MRP
- Show warning if discount is very high (e.g., >70%)

**Phase 1**: Implement Option 1 (inline editing)
**Phase 2**: Add Option 2 (bulk updates)

### 2.6 Analytics Dashboard (Phase 1: Basic, Phase 2: Advanced)
**Purpose**: View basic insights about product performance

**Phase 1 - Simple Analytics**:
- **Total Counts** (Cards at top):
  - Total Products (Active)
  - Total Categories
  - Total Wishlist Additions (all users)
  - Total Users Registered

- **Product Views**:
  - Table showing top 10 most viewed products
  - Columns: Product Name, View Count, Date Range
  - From product_views table

- **Recent Activity**:
  - Last 10 products added
  - Last 10 users registered

**Phase 2 - Advanced Analytics** (Mention only):
- Views over time (charts)
- Category-wise performance
- Conversion funnel (views → wishlist → orders)
- Revenue analytics (when ordering implemented)
- Export reports as CSV/PDF

### 2.7 Bulk Product Upload (Phase 2 - Document Intent Only)
**Purpose**: Upload multiple products at once via CSV

**Challenges**:
- How to handle images in bulk upload?
  - Option 1: CSV contains image URLs (images pre-uploaded to S3)
  - Option 2: Separate bulk image upload, then map to products by SKU
  - Option 3: Upload images via ZIP file, reference filenames in CSV

**Phase 1**: Not implemented (admin adds products one by one)
**Phase 2**: Design and implement based on chosen approach

---

## 3. TECHNICAL SPECIFICATIONS

### 3.1 Frontend Stack
- **Framework**: Next.js (React) with App Router (or Pages Router - agent's choice based on best practices)
- **Language**: TypeScript (preferred for type safety) or JavaScript (agent's choice)
- **Styling**: Tailwind CSS (recommended) or CSS Modules or styled-components (agent's choice)
- **UI Components**: 
  - Agent's choice: Material-UI / Chakra UI / shadcn/ui / Ant Design / Headless UI
  - Priority: Clean, minimal, mobile-responsive design
  - Should be efficient for both coding and rendering performance

### 3.2 State Management
- **Approach**: Start simple, scale as needed
  - Phase 1: React Context API for global state (auth, wishlist)
  - If Context becomes complex or causes performance issues → Move to Zustand
  - If app grows significantly → Consider Redux
- **Agent Decision**: Choose based on app complexity, prefer simpler solutions

### 3.3 API Integration (Mock for Phase 1)
- **Backend Communication**: RESTful APIs (or GraphQL if agent prefers)
- **Phase 1**: Use mock APIs
  - Create JSON files in `/mock_data` folder
  - Examples:
    - `/mock_data/products.json`
    - `/mock_data/categories.json`
    - `/mock_data/banners.json`
    - `/mock_data/users.json`
  - Use Next.js API routes (`/pages/api/*` or `/app/api/*`) to serve mock data
  - Mimic real API response structure

- **Phase 2**: Connect to actual backend
  - Replace mock API calls with real endpoints
  - Use axios or fetch for HTTP requests
  - Error handling, loading states, retry logic

**API Requirements Document** (To be provided to backend team):
- List all required endpoints with request/response schemas
- Example:
  ```
  GET /api/products?category_id={id}&page={num}&limit={num}
  Response: { products: [...], total_count: 100, page: 1, limit: 20 }
  
  POST /api/auth/send-otp
  Request: { phone: "+919876543210", email: "user@example.com" }
  Response: { success: true, message: "OTP sent" }
  ```

### 3.4 Image Storage
- **Service**: AWS S3 (primary choice)
- **Alternative**: Cloudinary (if requirements change or S3 integration is complex)
- **Upload Flow**:
  - Frontend: User selects image → Upload directly to S3 (via pre-signed URL from backend)
  - Or: Upload via backend API → Backend stores in S3
- **Image Optimization**:
  - Next.js Image component for automatic optimization
  - Lazy loading for images below the fold
  - Responsive images (srcset) for different screen sizes

### 3.5 Responsive Design
- **Priority**: Mobile-first for user-facing pages
- **Breakpoints** (Tailwind defaults or custom):
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Admin Panel**: Desktop-first, but should work on tablet/mobile (readable, but editing easier on desktop)
- **Testing**: Test on actual devices or browser dev tools

### 3.6 Performance Optimization
- **Loading Time Priority**: Optimize for fast loading on user-facing pages
- **Techniques**:
  - Next.js SSR/SSG for initial page load (static generation for product pages, SSR for dynamic content)
  - Code splitting (automatic with Next.js)
  - Lazy load images and components below the fold
  - Minimize JavaScript bundle size
  - Use CDN for static assets (S3 + CloudFront or similar)
  - Cache API responses (SWR or React Query)
- **Metrics**: Aim for Lighthouse score >90 on mobile

### 3.7 SEO Considerations (Phase 2 Focus)
- **Phase 1**: Basic SEO
  - Proper HTML structure (h1, h2, semantic tags)
  - Meta titles and descriptions (static or from product data)
  - Next.js Head component for meta tags
  
- **Phase 2**: Advanced SEO
  - Dynamic meta tags from product data
  - Open Graph tags for social sharing
  - Structured data (Schema.org JSON-LD for products)
  - Sitemap generation
  - Robots.txt

### 3.8 Security Considerations
- **Authentication**:
  - Secure OTP generation and verification (backend handles)
  - JWT tokens with expiration
  - HttpOnly cookies for session storage
  
- **Authorization**:
  - Role-based access control (RBAC)
  - Verify user role on frontend (UI) and backend (API)
  - Protect admin routes with middleware
  
- **Data Validation**:
  - Validate all user inputs on frontend and backend
  - Sanitize inputs to prevent XSS
  - CSRF protection for forms

- **Image Upload**:
  - Validate file type (only images: jpg, png, webp)
  - Limit file size (e.g., max 5MB per image)
  - Scan for malware (backend responsibility)

### 3.9 Accessibility (Basic in Phase 1)
- **Phase 1**:
  - Semantic HTML
  - Alt text for images
  - Keyboard navigation support
  - Sufficient color contrast
  
- **Phase 2**:
  - Screen reader optimization
  - ARIA labels where needed
  - Focus management
  - WCAG 2.1 AA compliance

---

## 4. USER FLOWS (Step-by-Step Journeys)

### Flow 1: Guest User Browses and Wishlists a Product
1. User lands on homepage
2. Sees banner carousel and categories
3. Clicks on "Kitchen Essentials" category
4. Sees subcategories: "Pressure Cooker", "Mixer Grinder", etc.
5. Clicks "Pressure Cooker"
6. Sees product tiles (3 variants: 2L, 3L, 5L Prestige Deluxe Alpha)
7. Clicks on "3L" variant tile
8. Navigated to Product Detail Page
   - Sees images, description, price, specifications
   - Sees other variants (2L, 5L) as selectable options
9. Clicks "Add to Wishlist" button
10. **Not logged in** → Redirected to Login page
11. Enters phone number, requests OTP
12. Enters OTP, verifies
13. Account created/logged in
14. **Redirected back to Product Detail Page** (return URL preserved)
15. Clicks "Add to Wishlist" again
16. Product added to wishlist, success message shown
17. User navigates to "My Wishlist" from header menu
18. Sees the 3L pressure cooker in wishlist

### Flow 2: Logged-in User Searches for Product
1. User already logged in (session active)
2. Clicks search bar in header
3. Types "prestige cooker"
4. Presses Enter or clicks search icon
5. Navigated to Search Results page
6. Sees all matching products (different sizes/variants shown as separate tiles)
7. Clicks on "5L" variant
8. Navigated to Product Detail Page
9. Browses, adds to wishlist (already logged in, no redirect)

### Flow 3: Admin Adds a New Product with Variants
1. Admin logs in with admin credentials
2. Redirected to Admin Dashboard
3. Clicks "Products" in sidebar
4. Clicks "Add New Product" button
5. Fills in product form:
   - Name: "Bajaj Rex Mixer Grinder 750W"
   - Brand: Selects "Bajaj" from dropdown
   - Category: Selects "Electronics > Mixer Grinder > 3 Jar"
   - Description: Enters detailed description
   - Base Price: 3200
   - Uploads 5 images (drag-drop to S3), sets one as primary
   - Status: Active
6. Adds first variant:
   - Variant Name: "Standard"
   - SKU: "BAJ-REX-750W"
   - MRP: 4000
   - Selling Price: 3200
   - Attributes: Adds {"power": "750W", "jars": "3", "warranty": "2 years"}
   - Is Default: Yes
7. Clicks "Add Another Variant" (if exists, e.g., different color)
8. Clicks "Publish" (saves with status=ACTIVE)
9. Success message: "Product added successfully"
10. Redirected to Product List
11. New product appears in list

### Flow 4: Admin Creates Homepage Banner
1. Admin navigates to "Banners" section
2. Clicks "Add New Banner"
3. Fills banner form:
   - Title: "Prestige Brand Sale"
   - Uploads banner image (1920x600)
   - Click Action: Selects "Link to Brand"
   - Selects "Prestige" from brand dropdown
   - Display Order: 1
   - Status: Active
4. Clicks "Save"
5. Banner added to homepage carousel
6. Admin views homepage to verify (logs out, checks as guest user)
7. Banner appears, clicking it shows all Prestige products

---

## 5. DATA STRUCTURE & BACKEND INTEGRATION

### 5.1 Database Schema (Reference)
**Based on**: `ecommerce_database_setup.sql` (PostgreSQL)

**Key Tables**:
- `categories`: Hierarchical structure with parent_id, path, level
- `brands`: Brand information
- `product_groups`: Parent products (e.g., "Prestige Deluxe Alpha")
- `products`: Variants (e.g., "2L", "3L", "5L")
- `product_images`: Images linked to products
- `users`: Phone-based auth, role (ADMIN/USER)
- `otp_verifications`: OTP tracking
- `wishlists`: User wishlists (supports session_id for anonymous)
- `product_views`: Analytics tracking
- `category_brands`: Performance optimization (pre-computed counts)

**Important Relationships**:
- Product Group → Has Many Products (variants)
- Product → Has Many Images
- Product Group → Belongs to Category
- Product Group → Belongs to Brand
- User → Has Many Wishlist Items

### 5.2 API Endpoints Required (Frontend Needs)

**User Endpoints**:
```
POST /api/auth/send-otp
POST /api/auth/verify-otp
GET /api/auth/me (get current user info)
POST /api/auth/logout
PUT /api/user/profile (update name, email, address)

GET /api/categories (get all categories with hierarchy)
GET /api/categories/:id/subcategories
GET /api/categories/:id/products

GET /api/products (with filters: category_id, brand_id, search_query, page, limit)
GET /api/products/:id (get product detail with variants)
GET /api/products/:id/related (related products)

GET /api/brands

GET /api/banners (active banners for homepage)

POST /api/wishlist (add item)
GET /api/wishlist (get user's wishlist)
DELETE /api/wishlist/:id (remove item)

POST /api/products/:id/views (track product view)
```

**Admin Endpoints**:
```
All user endpoints +

GET /api/admin/analytics/dashboard (summary stats)
GET /api/admin/analytics/top-products (most viewed)

GET /api/admin/products (all products with status filter)
POST /api/admin/products (create product with variants)
PUT /api/admin/products/:id (update product)
DELETE /api/admin/products/:id (delete/archive)
PUT /api/admin/products/:id/status (change status)

GET /api/admin/categories
POST /api/admin/categories
PUT /api/admin/categories/:id
DELETE /api/admin/categories/:id

GET /api/admin/banners
POST /api/admin/banners
PUT /api/admin/banners/:id
DELETE /api/admin/banners/:id

GET /api/admin/brands
POST /api/admin/brands
PUT /api/admin/brands/:id
DELETE /api/admin/brands/:id
```

### 5.3 Mock Data Structure Examples

**`/mock_data/products.json`**:
```json
{
  "products": [
    {
      "product_group_id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
      "name": "Prestige Deluxe Alpha Pressure Cooker",
      "slug": "prestige-deluxe-alpha-pressure-cooker",
      "description": "Premium stainless steel pressure cooker...",
      "brand": {
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "name": "Prestige"
      },
      "category": {
        "id": "44444444-4444-4444-4444-444444444444",
        "name": "Pressure Cooker",
        "path": "/kitchen-essentials/pressure-cooker/"
      },
      "base_price": 2500.00,
      "variants": [
        {
          "id": "12121212-1212-1212-1212-121212121212",
          "variant_name": "2 Litre",
          "sku": "PRE-DLX-ALP-2L",
          "mrp": 3000.00,
          "selling_price": 2500.00,
          "discount_percentage": 16.67,
          "attributes": {"size": "2L", "material": "Stainless Steel"},
          "is_default": true,
          "status": "ACTIVE"
        },
        {
          "id": "13131313-1313-1313-1313-131313131313",
          "variant_name": "3 Litre",
          "sku": "PRE-DLX-ALP-3L",
          "mrp": 3500.00,
          "selling_price": 2900.00,
          "discount_percentage": 17.14,
          "attributes": {"size": "3L", "material": "Stainless Steel"},
          "is_default": false,
          "status": "ACTIVE"
        }
      ],
      "images": [
        {
          "id": "img1",
          "url": "https://s3.example.com/products/prestige-cooker-1.jpg",
          "is_primary": true,
          "display_order": 1
        },
        {
          "id": "img2",
          "url": "https://s3.example.com/products/prestige-cooker-2.jpg",
          "is_primary": false,
          "display_order": 2
        }
      ],
      "rating": 4.5,
      "review_count": 120,
      "is_featured": true,
      "status": "ACTIVE"
    }
  ],
  "total_count": 50,
  "page": 1,
  "limit": 20
}
```

**`/mock_data/categories.json`**:
```json
{
  "categories": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Electronics",
      "slug": "electronics",
      "parent_id": null,
      "level": 0,
      "path": "/electronics/",
      "image_url": "https://s3.example.com/categories/electronics.jpg",
      "product_count": 25,
      "subcategories": [
        {
          "id": "33333333-3333-3333-3333-333333333333",
          "name": "Mixer Grinder",
          "slug": "mixer-grinder",
          "parent_id": "11111111-1111-1111-1111-111111111111",
          "level": 1,
          "path": "/electronics/mixer-grinder/",
          "product_count": 15
        }
      ]
    }
  ]
}
```

---

## 6. BUSINESS RULES & VALIDATIONS

### 6.1 Pricing Rules
- **MRP (Maximum Retail Price)**: Always required, must be > 0
- **Selling Price**: Must be ≤ MRP (cannot exceed MRP)
- **Discount Calculation**: ((MRP - Selling Price) / MRP) × 100
- **Warning**: If discount > 70%, show admin warning (possible error)

### 6.2 Product Status
- **ACTIVE**: Visible to users, appears in search/browse
- **DRAFT**: Not visible to users, admin can preview
- **ARCHIVED**: Hidden from users, not deleted (for record-keeping)
- Only ACTIVE products shown in user-facing pages

### 6.3 Inventory (Phase 2)
- **Phase 1**: No stock management on frontend
  - Backend stores stock_quantity in products table
  - All products assumed "In Stock" for display
- **Phase 2**: Show "Out of Stock" badge, prevent adding to cart if stock = 0

### 6.4 Category Hierarchy
- **Max Depth**: 3 levels (0, 1, 2)
- **Path**: Auto-generated based on parent hierarchy (e.g., "/electronics/mixer-grinder/3-jar/")
- **Deletion**: Deleting a parent category should handle child categories (either cascade delete or reassign)

### 6.5 Image Requirements
- **Formats**: JPG, PNG, WEBP
- **Max File Size**: 5MB per image (configurable)
- **Min Dimensions**: 800x800px (recommended for product images)
- **Primary Image**: One image per product marked as primary (shown in grids)

---

## 7. PHASE ROADMAP

### Phase 1 (PRIORITY - Implement Fully)
✅ Homepage with banner carousel and categories
✅ Category navigation (3-level hierarchy)
✅ Product grid/tiles display
✅ Product detail page with variants
✅ Wishlist functionality
✅ User authentication (phone OTP)
✅ Basic search (text matching)
✅ Admin: Product CRUD
✅ Admin: Category CRUD
✅ Admin: Banner CRUD
✅ Admin: Price management (inline editing)
✅ Admin: Basic analytics dashboard
✅ Responsive design (mobile-first for users, desktop-first for admin)
✅ Mock API integration

### Phase 2 (Future - Document Only)
🔲 Advanced search (autocomplete, fuzzy search)
🔲 Filters and sorting (price, brand, rating)
🔲 Ratings & reviews (submission, display)
🔲 Related products (AI recommendations)
🔲 Order management (cart, checkout, payment)
🔲 Order history for users
🔲 Inventory management (stock display, out-of-stock handling)
🔲 Bulk product upload (CSV with images)
🔲 Advanced analytics (charts, reports)
🔲 SEO optimization (structured data, dynamic meta tags)
🔲 Email notifications (OTP, order updates)
🔲 Delivery tracking
🔲 Admin: Bulk price updates
🔲 Admin: Review moderation
🔲 Multi-language support (if needed)

---

## 8. AGENT GUIDELINES

### 8.1 Decision-Making Principles
- **Simplicity First**: Choose simpler solutions unless complexity is justified
- **Performance**: Optimize for loading time, especially on mobile
- **User Experience**: Prioritize clean, intuitive UI
- **Scalability**: Build Phase 1 in a way that allows easy addition of Phase 2 features
- **Consistency**: Maintain consistent patterns across the app (naming, structure, styling)

### 8.2 Technology Choices
- **When in doubt**: Choose what's most common in modern React/Next.js development
- **State Management**: Start with Context, move to Zustand/Redux only if needed
- **Styling**: Tailwind CSS recommended for rapid, consistent styling
- **UI Library**: Any modern library is acceptable (MUI, Chakra, shadcn/ui) - choose based on design requirements

### 8.3 Code Quality
- **TypeScript**: Preferred for type safety (but JavaScript is acceptable)
- **Component Structure**: Reusable components, avoid duplication
- **Comments**: Document complex logic, especially business rules
- **Error Handling**: Graceful error messages for users, detailed logs for debugging
- **Loading States**: Show skeletons/spinners during data fetching

### 8.4 Documentation Requirements
- **Update `technical execution.md`**: Document architecture, page implementations, key decisions
- **Update `agent choices.md`**: Log all design decisions, technical choices, why certain approaches were taken
- **Code Comments**: Inline comments for non-obvious logic

---

## 9. OPEN QUESTIONS FOR NEXT ITERATION

1. **Banner Click Action**: For "40% off on Prestige" banner, should backend provide a pre-filtered API or should frontend construct filter?
2. **Category Drill-Down UI**: Confirm final design - simple navigation vs. '+' icon expansion?
3. **Admin Image Upload**: Direct upload to S3 from frontend (need S3 pre-signed URLs) or via backend API?
4. **Session Management**: JWT in localStorage, sessionStorage, or httpOnly cookies?
5. **Product URL Structure**: `/products/[slug]` or `/products/[id]`? (slug preferred for SEO)
6. **Search Results Page**: Same UI as category page (product grid) or different layout?
7. **Wishlist Merge**: When guest adds items to session-based wishlist, then logs in, should items merge or replace?

(These will be clarified in next brainstorming session)

---

**END OF FEATURES DOCUMENTATION - PHASE 1 READY FOR IMPLEMENTATION**