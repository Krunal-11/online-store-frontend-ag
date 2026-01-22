Comprehensive feature specifications organized by implementation priority - reference this when implementing specific functionality.

**Last Updated**: 2026-01-22 (Updated to reflect Phase 1 implementation through Step 9)

---

# FEATURES DETAILED

## How to Use This Document

- **Phase 1 features** = Must implement fully with all details
- **Phase 2 features** = Document awareness only, basic/demo implementation acceptable
- Each feature includes: Purpose, Components, Behavior, and Implementation Notes
- **Implementation Status**: ✅ Implemented | 🟡 Partial | ⬜ Not Started

---

# PHASE 1 FEATURES (FULL IMPLEMENTATION REQUIRED)

## 1. HOMEPAGE ✅

**Purpose**: Entry point that showcases products and enables navigation

### 1.1 Hero Banner Carousel ✅

**Components**:
- Rotating banner carousel with auto-play
- Next/Previous arrows (desktop only)
- Dot indicators for slide position
- Responsive images (desktop and mobile versions)

**Banner Click Behavior**:
Each banner can link to one of:
- Specific category (e.g., "Mixer Grinders")
- Specific brand (e.g., "All Prestige Products")
- Custom product collection (e.g., "40% off items")
- External URL (if needed)

**Implementation Notes** (Implemented):
- Uses `embla-carousel-react` with `embla-carousel-autoplay` plugin
- Auto-rotate every 5 seconds
- **No pause on hover** (simplified implementation)
- Swipe support on mobile via embla
- Minimum 2 banners, maximum 10 (configurable)
- Load active banners only (status = ACTIVE)
- Skeleton loader during fetch
- Desktop: 21:7 aspect ratio with arrows
- Mobile: 16:9 aspect ratio, swipe only

### 1.2 Category Display Section ✅

**Layout**: Grid of category cards with drill-down functionality

**Each Category Card Shows**:
- Category image (placeholder URLs via placehold.co in Phase 1)
- Category name
- **No product count** (simplified design per user request)

**Behavior** (Implemented):
- **Level 0 categories**: Always visible at top of grid
- **Click category WITH subcategories**: Subcategories appear BELOW the main grid (nested)
- **Click same category again**: Collapse the subcategories section
- **Click category WITHOUT subcategories**: Navigate to `/category/{slug}/products`
- **"View All Products" button**: Appears when subcategories expanded

**Selected State Indicator**:
- Light teal background (`bg-primary/10`) + teal border (`ring-2 ring-primary`)
- Chevron icon rotates 180° when expanded

**Nesting Depth** (max 3 levels: 0, 1, 2):
| Level | Behavior |
|-------|----------|
| Level 0 (Main) | Always visible, expandable |
| Level 1 (Sub) | Shown below Level 0 when parent expanded |
| Level 2 (Sub-sub) | Shown below Level 1, clicking navigates to products |

**Responsive Grid**:
- Mobile: 2 columns
- Tablet (md): 3-4 columns
- Desktop (lg+): 6 columns

### 1.3 Featured Products Section ✅

**Purpose**: Showcase featured products on homepage

**Implementation**:
- Uses `ProductCard` component in responsive grid
- Fetches featured products via `useFeaturedProducts` hook
- Skeleton loaders during loading state
- Shows products where `isFeatured: true`

### 1.4 Store Information Footer ✅

**Display**:
- Store name: "New Guru Enterprises"
- Address: "No. 5-4-726/1, Nampally Station Road ABIDS SOUTH Hyderabad, Telangana, 500001 India"
- Phone: "9849067667" (clickable tel: link on mobile)
- Tagline: "Wide Range of home appliances and kitchenware"
- "Home delivery available" badge/message

---

## 2. CATEGORY NAVIGATION & PRODUCT BROWSING ✅

### 2.1 Category Hierarchy Navigation ✅

**Structure**: Up to 3 levels
- **Level 0**: Main categories (e.g., "Electronics", "Kitchen Essentials")
- **Level 1**: Subcategories (e.g., "Mixer Grinder", "Pressure Cooker")
- **Level 2**: Sub-subcategories (e.g., "3 Jar", "Steel Base")

**Navigation Flow** (Implemented):
```
Homepage → Click "Electronics" (with subcategories) → 
Subcategories appear BELOW main grid (not new page) →
Click "Mixer Grinder" (with subcategories) →
Level 2 subcategories appear below →
Click "3 Jar" (no subcategories) →
Navigate to /category/3-jar/products
```

**URL Structure** (Implemented):
- Category products: `/category/{slug}/products`
- Flat slug-only (not nested paths)

**Category Products Page Components**:
- Breadcrumb navigation (e.g., "Home > Electronics > Mixer Grinder")
- Category title
- Product grid with infinite scroll
- Sort and brand filter controls

**Implementation Notes**:
- `useCategory(slug)` hook returns category, subcategories, and breadcrumb
- Products page fetches from `/api/products?categoryId={id}`

### 2.2 Product Grid Display ✅

**Purpose**: Show products in browseable tile format

**Product Tile Components** (each tile):
```
┌─────────────────────┐
│ [Discount Badge]  ♥ │ ← Top corners
│   Product Image     │ ← Primary image, hover zoom
├─────────────────────┤
│ BRAND NAME          │ ← Small, uppercase, gray text
│ Product Name        │ ← Bold, 2 lines max
│ ★ 4.5 (120)        │ ← Rating (if available)
│ ₹3000  ₹2500        │ ← MRP (strikethrough) + Selling Price
│ 16% OFF             │ ← Discount badge (green)
└─────────────────────┘
```

**Tile Behavior**:
- Click anywhere on tile → Navigate to product detail page
- Hover effect: Image zoom, text color change
- Lazy load images as user scrolls

**Grid Specifications**:
- Mobile: 2 columns
- Tablet (md): 3 columns
- Desktop (lg): 4 columns
- Gap between tiles: 16px

**Pagination** (Implemented):
- **Infinite scroll** using Intersection Observer
- SWR Infinite for paginated data fetching
- 30 products per page (configurable via `NEXT_PUBLIC_PRODUCTS_PER_PAGE`)
- 200px load trigger margin before reaching end

**Empty State**:
- Icon, message: "No products found"
- Customizable for different contexts (category, search)

### 2.3 Product Grid Controls ✅

**Components**:
- Sticky bar below main header on scroll
- Product count display
- Sort dropdown
- Brand filter dropdown (when applicable)
- "Clear filters" button when filters active

**Sort Options** (Implemented):
| Value | Label | Logic |
|-------|-------|-------|
| `relevance` | Relevance | Featured first, then by rating (default) |
| `price_asc` | Price: Low to High | Selling price ascending |
| `price_desc` | Price: High to Low | Selling price descending |
| `rating` | Customer Rating | Average rating descending |
| `discount` | Discount | Discount percentage descending |
| `newest` | Newest First | Created date descending |

**URL State**: Sort and brand filters stored in query params (?sort=, ?brand=)

---

## 3. PRODUCT DETAIL PAGE ✅

**Purpose**: Show complete product information and enable wishlist action

**URL Structure**: `/products/[slug]?variant={variant-slug}`

### 3.1 Image Gallery Section ✅

**Components** (Implemented - Hybrid Gallery):
- **Mobile (< 768px)**: Full-width carousel with swipe, dot indicators
- **Desktop (≥ 768px)**: Large primary image with thumbnail strip below
- Click thumbnail → Change main image
- Skeleton loader during image load

**Image Behavior**:
- Show images from product's image array
- Order by `displayOrder` field
- Primary image (`isPrimary: true`) shown first
- **Zoom functionality**: Not implemented in Phase 1

### 3.2 Product Information Section ✅

**Display Elements**:

1. **Brand Name** (small, above product name)
2. **Product Name** (large heading)
3. **Rating Display** (single star icon + rating number + review count)
   - Phase 1: Display only
   - Phase 2: Clickable to view reviews
4. **Pricing Block**:
   ```
   ₹3000  ₹2500  (16% OFF)
   MRP    Price   Badge
   ```
   - MRP: Gray, strikethrough
   - Selling Price: Large, bold, primary color
   - Discount: Success green text
   - Uses `Intl.NumberFormat` for INR formatting
5. **Wishlist Button**: Heart icon + "Add to Wishlist" text

### 3.3 Variant Selector ✅

**When to Show**: If product has multiple variants (count > 1)

**Display Format**: Pill buttons (implemented)
```
[ 2 Litre ] [ 3 Litre ] [ 5 Litre ]
       ↑ Selected (teal background)
```

**Variant Button Shows**:
- Variant name (e.g., "2 Litre", "Red", "750W 3 Jar")
- Price difference indicator (optional, future)

**Selection Behavior**:
- Click variant → Update displayed information instantly:
  - Images (switch to this variant's images)
  - Price (MRP and selling price)
  - Attributes (variant-specific)
- Default selection: First variant OR variant from URL parameter
- URL updates with variant: `?variant={variant-slug}`

**Variant Slug Format**: Lowercase, hyphenated (e.g., "3-litre", "750w-3-jar")

### 3.4 Action Buttons ✅

**Add to Wishlist Button**:
- Icon: Heart (outline when not in wishlist, filled when added)
- Text: "Add to Wishlist" or "Saved to Wishlist"
- Position: Prominent, in product info section
- Click behavior:
  - **If NOT logged in**: Redirect to login page with return URL
  - **If logged in**: Add to wishlist via API, show toast notification

**Phase 2 Buttons** (not in Phase 1):
- "Add to Cart"
- "Buy Now"

### 3.5 Additional Information (Accordion) ✅

**Accordion Layout** (using shadcn/ui Accordion):

1. **Product Details** (expanded by default)
   - Full description
   - All specifications from attributes (key-value pairs)

2. **Delivery Information**
   - Static content: "Home delivery available. Contact us for delivery details."
   - Store address and phone number

3. **Return & Exchange Policy**
   - Static content (standard policy text)

### 3.6 Related Products Section ✅

**Purpose**: Show similar products

**Implementation** (Phase 1):
- Horizontal scrollable carousel using embla-carousel
- Shows products from same category, excluding current product
- Limited to 8 products
- Uses ProductCard component (smaller variant)

**Display**: 
- Desktop: 4 visible products with prev/next arrows
- Mobile: 2 visible products, swipe to navigate

---

## 4. WISHLIST ⬜

### 4.1 Access Control

**Guest Users**:
- Can browse products
- Clicking "Add to Wishlist" → Redirect to login page
- After login → Redirect back to original page

**Logged-in Users**:
- Can add/remove items freely
- Wishlist persists across sessions
- Can browse products
- Clicking "Add to Wishlist" → Redirect to login page
- After login → Redirect back to original page
- *(Optional: Allow session-based wishlist for guests that merges on login - Phase 2)*

**Logged-in Users**:
- Can add/remove items freely
- Wishlist persists across sessions

### 4.2 Wishlist Page

**URL**: `/wishlist` or `/my-wishlist`

**Access**: Via header/navbar menu item "Wishlist" or "My Wishlist"

**Page Components**:

1. **Header Section**:
   - Title: "My Wishlist"
   - Item count: "(5 items)"
   - Optional: "Clear All" button

2. **Product Grid**:
   - Same layout as product browsing grid
   - Each tile shows:
     - Product image
     - Product name
     - Brand
     - Current price (fetch real-time from API)
     - Discount badge (if applicable)
     - "Remove" button (X icon or trash icon)
     - "View Details" button

3. **Empty State**:
   - Message: "Your wishlist is empty"
   - Illustration (optional)
   - CTA: "Browse Products" button → Homepage

**Behavior**:
- Click product tile → Navigate to product detail page
- Click "Remove" → Remove from wishlist, update UI immediately
- Real-time price: Show current price (may differ from when added to wishlist)
- If product becomes ARCHIVED/INACTIVE → Show "No longer available" badge

**Implementation Notes**:
- Fetch wishlist items via API: GET /api/wishlist
- Each item includes full product details (joined data)
- Optimistic UI updates (remove immediately, rollback if API fails)

---

## 5. USER AUTHENTICATION ✅

### 5.1 Login Flow (Phone OTP)

**Trigger Points**:
- Click "Login" button in header/navbar
- Attempt to add to wishlist while not logged in
- Access user-specific pages (profile, orders, wishlist)

**Implementation**: Dedicated login page at `/login` (not modal)

**Step 1: Phone Input**
- Dedicated page (`/login`)
- Form fields:
  - Country code: Dropdown with editable input (default: +91)
  - Phone number: Numeric only, max 15 digits
- Validation:
  - Phone: Required, 6-15 digits after country code
- Button: "Send OTP"
- Click → Call API: POST /api/auth/send-otp

**Step 2: OTP Verification**
- Display after OTP sent successfully
- Show: "OTP sent to [phone]"
- Form: 6 individual input boxes (48x56px each)
- Auto-focus on first box
- Arrow key navigation between boxes
- Paste support for full OTP
- "Verify OTP" button
- "Resend OTP" link (enabled after 30 seconds countdown)
- Click Verify → Call API: POST /api/auth/verify-otp

**Step 3: New User Name Entry**
- If `isNewUser: true` from verify response
- Show name input field
- User enters name
- Call API: PUT /api/auth/profile
- Then proceed to redirect

**Step 4: Success**
- Store session token (localStorage in Phase 1)
- Redirect to:
  - Return URL (if provided via `?returnUrl=`)
  - OR Homepage (default)
  - OR Admin Dashboard (if user is admin)
- Header updates to show user name

**Error Handling**:
- Invalid phone number: "Please enter a valid phone number"
- OTP send failed: "Failed to send OTP. Please try again."
- Invalid OTP: "Invalid OTP. Please try again." (red border on inputs)
- Expired OTP: "OTP expired. Please request a new one."

**Loading States**:
- Sending OTP: Button disabled, spinner, "Sending OTP..."
- Verifying: Button disabled, spinner, "Verifying..."

### 5.2 User Session Management

**Session Storage** (Implemented):
- **localStorage** for Phase 1 (simpler for mock)
- Will migrate to httpOnly cookies for production

**Session Persistence**:
- Keep user logged in across browser sessions
- Token expiry: 30 days (mock implementation)

**Protected Routes**:
- Wishlist page
- Profile page (Phase 2)
- Orders page (Phase 2)

**Session Check**:
- On app mount via `AuthProvider`
- Calls `/api/auth/me` to validate token

### 5.3 Admin Detection

**Implementation**: Admin role determined by phone number

| Phone | Role | User |
|-------|------|------|
| +919849067667 | ADMIN | Store owner |
| Any other | USER | Regular customer |

**Admin Access**:
- Admin link visible in mobile navigation
- Header shows Admin Panel link for admin users

### 5.4 Logout Behavior

- Clear session token from localStorage
- Redirect to homepage
- Header updates to show "Login" button

---

## 6. SEARCH FUNCTIONALITY ⬜

### 6.1 Phase 1 Implementation (Basic)

**Purpose**: Allow text-based product search

**UI Components**:
- Search bar in header (always visible or expandable icon)
- Search icon button
- Input placeholder: "Search for products..."

**Behavior**:
- User types query and presses Enter or clicks search icon
- Navigate to search results page: `/search?q=[query]`
- Display results in product grid format (same as category pages)
- Show query in page title: "Search results for '[query]'"
- If no results: "No products found for '[query]'"

**Backend Expectation**:
- API: GET /api/products?search=[query]
- Uses trigram search on product_groups.name and search_keywords
- Returns matching products with relevance sorting

**Phase 1 Limitations**:
- No autocomplete
- No search suggestions
- No filters on search results
- Simple text matching

### 6.2 Phase 2 Enhancements (Document Only - No Implementation)

**Autocomplete**:
- Show suggestions dropdown as user types
- Suggest products, categories, brands

**Search Features**:
- Typo tolerance (fuzzy matching)
- Search within category
- Search history (recent searches)
- Popular searches

**Advanced Filters**:
- Same filters as category pages (price, brand, rating)
- Sorting options

**Voice Search**:
- Microphone icon in search bar
- Speech-to-text search

---

## 7. ADMIN PANEL

### 7.1 Access & Navigation

**Authentication**:
- Same login flow as users (phone OTP)
- After login, check user role from database (users.role)
- If role = 'ADMIN': Show admin navigation
- If role = 'USER': Redirect to homepage, deny admin access

**URL Structure**: `/admin/*`

**Admin Navigation** (Sidebar or Top Nav):
- Dashboard (home)
- Products
- Categories
- Banners
- Brands (optional: Phase 2)
- Orders (Phase 2 - show but disable)
- Analytics (Phase 1: basic stats)
- Logout

**UI Design**:
- Desktop-first (optimized for large screens)
- Responsive for tablet (usable but easier on desktop)
- Limited mobile support (can view but editing difficult)
- Clean, professional admin theme (agent can choose UI library)

**Route Protection**:
- Middleware checks user role on all /admin/* routes
- Non-admin users get 403 error or redirect

---

## 8. ADMIN - PRODUCT MANAGEMENT

### 8.1 Product List View

**Purpose**: Overview of all products with quick actions

**Layout**: Data table with columns:
- Checkbox (for bulk actions - Phase 2)
- Product Image (small thumbnail)
- Product Name (clickable → edit page)
- Brand
- Category (show full path: "Electronics > Mixer Grinder")
- Base Price (₹)
- Variants Count (e.g., "3 variants")
- Status (Active/Draft/Archived - color-coded badge)
- Actions (Edit, Delete icons)

**Features**:
- Search bar: Search by product name, SKU, brand
- Filter dropdowns: 
  - Filter by Category (hierarchical dropdown)
  - Filter by Brand
  - Filter by Status
- Sort options: Name (A-Z), Price (Low-High), Date Added (Newest)
- Pagination: 20 products per page
- "Add New Product" button (prominent, top-right)

**Quick Actions**:
- Click row → Navigate to edit page
- Edit icon → Edit page
- Delete icon → Confirmation modal → Delete product
- Status badge → Click to quick-change status (Active ↔ Draft ↔ Archived)

### 8.2 Add/Edit Product Form

**Page Layout**: Form with sections/tabs

**Section 1: Basic Information**

Fields:
- **Product Name*** (required)
  - Text input
  - Example: "Prestige Deluxe Alpha Pressure Cooker"
  
- **Brand*** (required)
  - Dropdown select from brands table
  - Option to add new brand (inline or redirect)
  
- **Category*** (required)
  - Hierarchical dropdown or nested selects
  - Example: Electronics > Mixer Grinder > 3 Jar
  - Show full category path
  
- **Description**
  - Textarea (rich text editor optional)
  - Multiple paragraphs allowed
  
- **Search Keywords**
  - Text input, comma-separated tags
  - Example: "cooker, kitchen, pressure, stainless steel, cooking"
  - Helper text: "Add keywords to help users find this product"
  
- **Base Price**
  - Number input (₹)
  - Helper text: "Reference price, actual price set per variant"
  
- **Status*** (required)
  - Radio buttons or dropdown: Active / Draft / Archived
  - Default: Draft (for new products)
  
- **Is Featured**
  - Checkbox
  - "Show this product in featured/recommended sections"

**Section 2: Product Images**

**Image Upload Interface**:
- Drag-and-drop zone: "Drag images here or click to upload"
- Click → File browser (accept: .jpg, .png, .webp)
- Multiple files upload supported
- No limit on image count (Phase 1)
- Upload destination: AWS S3 (agent handles S3 integration)

**Uploaded Images Display**:
- Grid of uploaded images (thumbnails)
- Each image shows:
  - Thumbnail preview
  - Filename
  - Radio button: "Set as Primary"
  - Delete button (X icon)
  - Display order input (number) - OR drag handles for reordering
  
**Primary Image**:
- One image must be marked as primary (shown in product tiles)
- If no primary selected: Use first image as default
- Radio button selection or star icon to mark primary

**Image Validation**:
- File type: jpg, png, webp only
- Max file size: 5MB per image
- Show error if validation fails

**Section 3: Product Variants**

**Why Variants**: Same product in different sizes/colors/specs (e.g., 2L, 3L, 5L cooker)

**Variant List Interface**:
- Show existing variants as expandable cards or table rows
- Each variant card/row shows: Variant Name, SKU, MRP, Selling Price, Status
- "Add New Variant" button

**Add/Edit Variant Form** (within product form):

Fields per variant:
- **Variant Name*** (required)
  - Text input
  - Example: "2 Litre", "Red Color", "Medium Size"
  
- **SKU*** (required)
  - Text input, auto-generated or manual
  - Must be unique across all products
  - Example: "PRE-DLX-ALP-2L"
  - Validation: Check uniqueness on blur
  
- **MRP*** (required)
  - Number input (₹)
  - Validation: Must be > 0
  
- **Selling Price*** (required)
  - Number input (₹)
  - Validation: Must be ≤ MRP
  - Show calculated discount percentage: "16% off"
  - Warning if discount > 70%: "Very high discount - please verify"
  
- **Stock Quantity**
  - Number input
  - Phase 1: Store in database but don't display to users
  - Phase 2: Show "Out of Stock" on frontend
  
- **Attributes** (JSON key-value pairs)
  - Dynamic form: Click "Add Attribute" to add rows
  - Each row has:
    - Key input: "size", "color", "material", "warranty"
    - Value input: "2L", "Red", "Stainless Steel", "5 years"
  - Remove row button
  - Example result: `{"size": "2L", "material": "Stainless Steel", "warranty": "5 years"}`
  
- **Status**
  - Dropdown: Active / Inactive
  - Default: Active
  
- **Is Default Variant**
  - Checkbox
  - Only one variant can be default per product
  - Default variant shown first on product detail page

**Variant Actions**:
- "Add Another Variant" button
- "Remove Variant" button (with confirmation)
- Expand/collapse variant details

**Form Validation Rules**:
- At least one variant required
- Product name, brand, category are required
- Each variant must have: name, SKU, MRP, selling price
- MRP ≥ Selling Price (enforce)
- SKU must be unique (check via API)
- Only one default variant per product

**Save Actions**:
- "Save as Draft" button: Saves with status = DRAFT
- "Publish" button: Saves with status = ACTIVE
- Show loading state during save
- On success: Show "Product saved successfully" toast → Redirect to product list OR stay on page (agent's choice)
- On error: Show error message, keep user on form with data preserved

### 8.3 Delete Product

**Trigger**: Click delete icon in product list OR delete button on edit page

**Behavior**:
- Show confirmation modal:
  - Title: "Delete Product?"
  - Message: "Are you sure you want to delete '[Product Name]' and all its variants? This action cannot be undone."
  - Buttons: "Cancel" (gray), "Delete" (red)
- On confirm:
  - Call API: DELETE /api/admin/products/:id
  - On success: Remove from list, show "Product deleted" toast
  - On error: Show error message

**Implementation Choice**: Soft delete (change status to ARCHIVED) vs hard delete
- **Recommended**: Soft delete (status = ARCHIVED) for data integrity
- Product no longer appears in user-facing pages
- Admin can view archived products with filter
- Can restore by changing status back to ACTIVE

---

## 9. ADMIN - CATEGORY MANAGEMENT

### 9.1 Category List View

**Layout Options**:
- **Option A**: Tree/Hierarchical view (expandable nodes)
- **Option B**: Table view with indentation showing hierarchy
- Agent's choice based on UI library capabilities

**Display Elements**:
- Category Image (small thumbnail)
- Category Name (indented based on level)
- Parent Category (if applicable)
- Level (0, 1, or 2)
- Product Count (how many products in this category)
- Display Order (for sorting)
- Status (Active/Inactive badge)
- Actions (Edit, Delete)

**Features**:
- "Add New Category" button
- Drag-and-drop reordering (Phase 2)
- Expand/collapse tree nodes (if tree view)
- Quick status toggle

### 9.2 Add/Edit Category Form

**Form Fields**:

- **Category Name*** (required)
  - Text input
  - Example: "Mixer Grinder"
  
- **Slug**
  - Text input (auto-generated from name, can edit)
  - Example: "mixer-grinder"
  - Validation: Must be unique, lowercase, hyphens only
  - Used in URL: /category/mixer-grinder
  
- **Parent Category**
  - Dropdown (optional)
  - Options: None (for Level 0) OR any existing category
  - If parent selected: New category level = Parent level + 1
  - Validation: Cannot select if parent is already Level 2 (max depth = 3 levels)
  - Show hierarchy in dropdown: "Electronics > Mixer Grinder"
  
- **Description**
  - Textarea
  - Displayed on category page (optional)
  
- **Display Order**
  - Number input
  - Lower numbers appear first
  - Default: 0
  
- **Category Image**
  - Single image upload
  - Drag-drop or click to browse
  - Upload to S3
  - Preview after upload
  - "Replace Image" and "Remove Image" buttons
  - Recommended size: 500x500px square
  
- **Status**
  - Radio buttons: Active / Inactive
  - Inactive categories not shown to users

**Additional Fields (Phase 2 - SEO)**:
- Meta Title
- Meta Description

**Auto-Calculated Fields** (not user input):
- Level: Calculated based on parent (0 if no parent, parent.level + 1 if parent)
- Path: Generated from hierarchy (e.g., "/electronics/mixer-grinder/3-jar/")

**Validation Rules**:
- Category name required
- Slug must be unique
- Cannot create Level 3+ (max level = 2, which is the 3rd level: 0,1,2)
- Cannot select category as its own parent (circular reference prevention)
- If parent changes, validate that new depth doesn't exceed max

**Save Behavior**:
- "Save" button
- Generate slug from name if not manually set
- Calculate and store path based on parent hierarchy
- On success: Redirect to category list, show "Category saved" toast
- On error: Show validation errors

### 9.3 Delete Category

**Trigger**: Delete icon/button

**Confirmation Modal**:
- Warning: "This category has [X] products and [Y] subcategories. What would you like to do?"
- Options:
  - **Soft Delete**: Change status to Inactive (category hidden but data preserved)
  - **Hard Delete**: Remove category (agent must decide how to handle products and subcategories)

**Phase 1 Recommendation**: Soft delete only
- Change status to INACTIVE
- Products remain assigned to this category but won't show in navigation
- Can reactivate later

**Phase 2 Consideration**:
- Hard delete with product reassignment (move products to parent category or "Uncategorized")

---

## 10. ADMIN - BANNER MANAGEMENT

### 10.1 Banner List View

**Layout**: Table or card grid

**Columns/Display**:
- Banner Image (small preview)
- Title (internal reference name)
- Click Action (e.g., "Category: Mixer Grinder", "Brand: Prestige")
- Display Order
- Status (Active/Inactive)
- Actions (Edit, Delete)

**Features**:
- Drag-to-reorder banners (display order) - Phase 2
- OR Manual order input - Phase 1
- "Add New Banner" button
- Quick status toggle

### 10.2 Add/Edit Banner Form

**Form Fields**:

- **Title*** (required)
  - Text input (internal reference, not shown to users)
  - Example: "Prestige Summer Sale 2025"
  
- **Banner Image*** (required)
  - Single image upload
  - Drag-drop or click to browse
  - Upload to S3
  - Recommended dimensions: 1920x600 (desktop), 800x400 (mobile)
  - Option: Upload separate mobile image OR use same image (responsive)
  - Preview uploaded image
  - Replace/remove buttons
  
- **Click Action*** (required)
  - Radio buttons with conditional fields:
  
  **Option 1: Link to Category**
  - Select category from dropdown (hierarchical)
  - When clicked: Navigate to category page
  
  **Option 2: Link to Brand**
  - Select brand from dropdown
  - When clicked: Show all products of that brand
  
  **Option 3: Link to Product Collection** (Phase 1: simple, Phase 2: advanced)
  - Phase 1: Dropdown of pre-defined collections (e.g., "Discounted Products", "Featured Products")
  - Phase 2: Custom filter builder (e.g., "Products with >30% discount")
  
  **Option 4: External URL**
  - Text input for URL
  - When clicked: Navigate to external link
  
- **Display Order**
  - Number input
  - Lower numbers appear first in carousel
  - Default: Next available number
  
- **Status**
  - Radio buttons: Active / Inactive
  - Only Active banners shown in carousel

**Phase 2 Fields** (not in Phase 1):
- Start Date / End Date (schedule banners)
- Target audience (all users, new users, etc.)

**Validation**:
- Title and image required
- Click action must be selected with appropriate target (category/brand/URL)
- Image file type: jpg, png, webp
- Image max size: 5MB

**Save Behavior**:
- "Save" button
- On success: Redirect to banner list, show "Banner saved" toast
- On error: Show errors

### 10.3 Delete Banner

**Trigger**: Delete button

**Confirmation**: Simple modal: "Delete this banner?"

**Behavior**: Hard delete (remove from database)
- No products affected, safe to delete

---

## 11. ADMIN - PRICE MANAGEMENT

### 11.1 Quick Price Edit (Phase 1)

**Location**: Within product list view

**Inline Editing**:
- MRP and Selling Price columns are editable
- Click on price → Input field appears
- Edit value → Press Enter or click checkmark to save
- Show loading indicator during save
- On success: Update table, show subtle success indicator
- On error: Revert to original value, show error

**Validation**:
- Prices must be > 0
- Selling price ≤ MRP (enforce)
- If selling > MRP: Show error "Selling price cannot exceed MRP"

**Discount Calculation**:
- Auto-calculate and display discount percentage
- Update in real-time as prices change

### 11.2 Bulk Price Update (Phase 2 - Document Only)

**Purpose**: Update multiple products at once

**Feature** (not implemented in Phase 1):
- Select products via checkboxes
- Click "Bulk Update Prices" button
- Modal with options:
  - Increase all prices by X%
  - Decrease all prices by X%
  - Set specific MRP or selling price
- Preview changes before applying
- Confirm and save

---

## 12. ADMIN - ANALYTICS DASHBOARD

### 12.1 Phase 1: Basic Analytics

**Purpose**: Simple insights for admin

**Dashboard Layout**:

**Top Section: Summary Cards**
- Total Active Products (count)
- Total Categories (count)
- Total Registered Users (count)
- Total Wishlist Items (count across all users)

**Section 2: Top Viewed Products**
- Table showing top 10 most viewed products
- Columns: Rank, Product Name, View Count, Last Viewed
- Data from `product_views` table
- Sortable by view count

**Section 3: Recent Activity**
- Last 10 products added (show name, date added)
- Last 10 user registrations (show name/phone, date)

**Implementation**:
- Simple cards and tables
- No complex charts (Phase 1)
- Real-time data (fetch on page load)

### 12.2 Phase 2: Advanced Analytics (Document Only)

**Features to add later**:
- Line charts: Views over time, user registrations over time
- Category performance (which categories get most views)
- Conversion funnel: Views → Wishlist → Orders (when ordering added)
- Revenue analytics (when orders implemented)
- Export reports (CSV/PDF)
- Date range selector for all charts
- Comparison periods (this month vs last month)

---

# PHASE 2 FEATURES (FUTURE IMPLEMENTATION)

## Features to Document Awareness (Not Fully Implement Now)

### 1. Advanced Search
- Autocomplete suggestions
- Recent searches
- Typo tolerance
- Voice search

### 2. Filters & Sorting
- Price range slider
- Brand filters
- Rating filters
- Multiple sort options
- Applied filters display with clear button

### 3. Ratings & Reviews
**User Functionality**:
- Submit review after purchase
- Star rating (1-5)
- Written review with photos
- Helpful/Not Helpful voting

**Admin Functionality**:
- Review moderation (approve/reject)
- Respond to reviews
- Flag inappropriate reviews

### 4. Shopping Cart & Checkout
**Cart**:
- Add products to cart
- Adjust quantities
- Remove items
- Cart summary (subtotal, delivery, total)

**Checkout**:
- Address form
- Payment integration (gateway TBD)
- Order confirmation
- Email/SMS notifications

### 5. Order Management
**User**:
- Order history
- Order details
- Track order status
- Reorder items

**Admin**:
- View all orders
- Update order status
- Manage deliveries
- Print invoices

### 6. Inventory Management
- Stock tracking
- Low stock alerts
- Auto-update stock on orders
- Show "Out of Stock" badge to users

### 7. Advanced Features
- Bulk product upload (CSV + images)
- Coupon/discount codes
- Customer support chat
- Email marketing integration
- Multi-language support
- Push notifications

---

**Implementation Priority**: Complete all Phase 1 features before starting Phase 2. Each Phase 2 feature should be planned and scoped separately.
