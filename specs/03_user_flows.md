Step-by-step user journeys showing how users and admins interact with the application - use this to understand complete workflows.

---

# USER FLOWS

## How to Use This Document

Each flow shows a complete journey from start to finish. Use these to:
- Understand end-to-end interactions
- Identify all required UI states (loading, error, success)
- Plan navigation and redirects
- Design API call sequences

---

# CUSTOMER FLOWS

## Flow 1: Guest User Discovers and Wishlists a Product

**Scenario**: First-time visitor browses products and saves one to wishlist

### Steps:

1. **Homepage Landing**
   - User opens website → Homepage loads
   - Sees: Banner carousel (auto-rotating), Category cards, Store info footer
   - No authentication required

2. **Browse by Category**
   - User clicks "Kitchen Essentials" category card
   - Navigate to: `/categories/kitchen-essentials`
   - Page shows: Breadcrumb (Home > Kitchen Essentials), Subcategory cards

3. **Navigate to Subcategory**
   - User clicks "Pressure Cooker" subcategory
   - Navigate to: `/categories/pressure-cooker`
   - Page shows: Breadcrumb (Home > Kitchen Essentials > Pressure Cooker), Product grid

4. **View Product Grid**
   - Sees multiple product tiles (3 tiles: 2L, 3L, 5L Prestige Deluxe Alpha variants)
   - Each tile shows: Image, Brand, Name, Rating, MRP (strikethrough), Price, Discount badge
   - Products load with lazy loading as user scrolls

5. **Open Product Detail**
   - User clicks "3 Litre" variant tile
   - Navigate to: `/products/prestige-deluxe-alpha-pressure-cooker?variant=3L`
   - Page loads:
     - Image gallery (primary image + thumbnails)
     - Product info (brand, name, rating, prices, description)
     - Variant selector (2L, 3L selected, 5L buttons)
     - Specifications table
     - "Add to Wishlist" button
     - Related products section

6. **Attempt to Wishlist (Not Logged In)**
   - User clicks "Add to Wishlist" button
   - System checks: User not authenticated
   - Action: Redirect to login page
   - Return URL preserved: `/login?returnUrl=/products/prestige-deluxe-alpha-pressure-cooker?variant=3L`

7. **Login Flow Initiated**
   - Login page/modal opens
   - Shows: Phone number input (+91 prefix), Optional email input
   - User enters: Phone "9876543210"
   - User clicks: "Send OTP"

8. **OTP Verification**
   - API call: POST /api/auth/send-otp → Success
   - UI updates: Show OTP input field (6 digits)
   - Display: "OTP sent to +919876543210"
   - User receives SMS with OTP: "123456"
   - User enters OTP in input
   - User clicks: "Verify OTP"

9. **First-Time User Setup**
   - API call: POST /api/auth/verify-otp → Success (new user created)
   - System detects: User name not set
   - UI shows: "Welcome! Please enter your name" prompt
   - User enters: "Rajesh Kumar"
   - Clicks: "Continue"
   - Profile updated with name

10. **Post-Login Redirect**
    - Session token stored (cookie/localStorage)
    - Header updates: Show "Hi, Rajesh" with user menu
    - Redirect to: Return URL (product page with variant)
    - URL: `/products/prestige-deluxe-alpha-pressure-cooker?variant=3L`

11. **Add to Wishlist (Logged In)**
    - User clicks "Add to Wishlist" button again
    - System checks: User authenticated ✓
    - API call: POST /api/wishlist { product_id, variant_id }
    - Success response received
    - UI updates:
      - Button changes to "Saved" with filled heart icon
      - Toast notification: "Added to wishlist"
      - Wishlist count in header increments: "Wishlist (1)"

12. **View Wishlist**
    - User clicks "Wishlist" in header menu
    - Navigate to: `/wishlist`
    - Page shows:
      - Header: "My Wishlist (1 item)"
      - Product grid with saved item (3L Prestige cooker)
      - Each item has: Image, Name, Brand, Current price, "Remove" button

**Alternative Paths**:
- **If user was already logged in**: Skip steps 7-10, directly add to wishlist
- **If OTP verification fails**: Show error, allow retry or resend OTP
- **If API error during wishlist add**: Show error toast, keep button as "Add to Wishlist"

---

## Flow 2: Returning User Searches for Product

**Scenario**: Logged-in user searches for specific product

### Steps:

1. **Already Logged In**
   - User opens website (session token valid)
   - Homepage loads with user menu showing "Hi, [Name]"
   - Header shows: Wishlist count, Profile dropdown

2. **Initiate Search**
   - User clicks search bar in header
   - Search bar expands or focus on input
   - Placeholder visible: "Search for products..."

3. **Enter Search Query**
   - User types: "prestige cooker"
   - Phase 1: No autocomplete (just typing)
   - User presses: Enter key OR clicks search icon

4. **View Search Results**
   - Navigate to: `/search?q=prestige+cooker`
   - Loading state: Show skeleton tiles
   - API call: GET /api/products?search=prestige+cooker
   - Page shows:
     - Page title: "Search results for 'prestige cooker'"
     - Result count: "Found 5 products"
     - Product grid with matching products (all variants as separate tiles)

5. **Select Specific Variant**
   - User sees: 2L, 3L, 5L variants as separate tiles
   - User clicks: "5 Litre" variant tile
   - Navigate to: `/products/prestige-deluxe-alpha-pressure-cooker?variant=5L`

6. **Add to Wishlist (Already Logged In)**
   - Product detail page loads
   - 5L variant pre-selected (from URL parameter)
   - User clicks: "Add to Wishlist"
   - API call: POST /api/wishlist → Success (no redirect, user authenticated)
   - UI updates: Button → "Saved", Toast → "Added to wishlist"

**Alternative Paths**:
- **No search results**: Show "No products found for 'prestige cooker'", suggest "Browse all products"
- **Network error during search**: Show error message, "Try again" button

---

## Flow 3: User Explores Product Variants

**Scenario**: User compares different variants of same product

### Steps:

1. **Land on Product Page**
   - User navigates to: `/products/prestige-deluxe-alpha-pressure-cooker`
   - Default variant loads (2L - marked as is_default_variant = true)
   - URL updates to: `/products/prestige-deluxe-alpha-pressure-cooker?variant=2L`

2. **View Default Variant Info**
   - Displays:
     - Images for 2L variant
     - Price: MRP ₹3000, Selling ₹2500 (16% OFF)
     - Attributes: Size: 2L, Material: Stainless Steel, Warranty: 5 years
   - Variant selector shows: [2L Selected] [3L] [5L]

3. **Switch to Different Variant**
   - User clicks: "3L" variant button
   - UI updates immediately (no page reload):
     - Images change to 3L variant images
     - Price updates: MRP ₹3500, Selling ₹2900 (17% OFF)
     - Attributes update: Size: 3L (other attributes same)
     - Variant selector: [2L] [3L Selected] [5L]
   - URL updates: `/products/prestige-deluxe-alpha-pressure-cooker?variant=3L`

4. **Compare Another Variant**
   - User clicks: "5L" variant button
   - Same update process:
     - Images, prices, attributes all update for 5L
     - URL: `/products/prestige-deluxe-alpha-pressure-cooker?variant=5L`

5. **Wishlist Specific Variant**
   - User decides on 3L variant
   - Clicks: "3L" button to select it
   - Clicks: "Add to Wishlist"
   - Wishlist saves: Product Group ID + Variant ID (3L specifically)

6. **View Wishlisted Variant Later**
   - User goes to: `/wishlist`
   - Sees: "Prestige Deluxe Alpha Pressure Cooker - 3 Litre" (variant name included)
   - Clicks tile → Returns to product page with 3L pre-selected

**Key Behavior**:
- Variant switching is instant (client-side state update)
- URL always reflects current variant for shareable links
- Wishlist saves specific variant, not just product group

---

## Flow 4: User Browses Category Hierarchy

**Scenario**: User navigates through 3-level category structure

### Steps:

1. **Homepage - Level 0 Categories**
   - User sees main category cards: "Electronics", "Kitchen Essentials"
   - Clicks: "Electronics"

2. **Level 1 - Subcategories**
   - Navigate to: `/categories/electronics`
   - Breadcrumb: Home > Electronics
   - Page shows: Subcategory cards (Mixer Grinder, Other subcategories)
   - Clicks: "Mixer Grinder"

3. **Level 2 - Sub-subcategories**
   - Navigate to: `/categories/mixer-grinder`
   - Breadcrumb: Home > Electronics > Mixer Grinder
   - Page shows: Sub-subcategory cards ("3 Jar", "4 Jar")
   - Clicks: "3 Jar"

4. **Level 3 - Products (Deepest Level)**
   - Navigate to: `/categories/3-jar`
   - Breadcrumb: Home > Electronics > Mixer Grinder > 3 Jar
   - Page shows: Product grid (no more subcategories, this is deepest level)
   - Displays: All products in "3 Jar" category

5. **Breadcrumb Navigation**
   - User clicks: "Mixer Grinder" in breadcrumb
   - Navigate back to: `/categories/mixer-grinder`
   - Shows: Sub-subcategory view again

**Alternative Path - Category with No Subcategories**:
1. User clicks category that has no children
2. Page directly shows product grid (skips subcategory view)
3. Example: Click "Pressure Cooker" → Directly shows pressure cooker products

---

## Flow 5: User Views Related Products

**Scenario**: User discovers similar products from product page

### Steps:

1. **On Product Detail Page**
   - User viewing: "Prestige Deluxe Alpha Pressure Cooker"
   - Scrolls down past description and specifications

2. **Related Products Section**
   - Section title: "You might also like" or "Similar Products"
   - Shows: 4-6 product tiles (horizontal scrollable carousel)
   - Products shown: Other pressure cookers (same category) or other Prestige products (same brand)

3. **Click Related Product**
   - User clicks: "Hawkins Pressure Cooker" tile from related section
   - Navigate to: `/products/hawkins-pressure-cooker`
   - New product page loads
   - Related products section now shows different products (related to Hawkins)

**Phase 1 Logic**:
- Show products from same category (excluding current product)
- OR same brand (excluding current product)
- Simple, no AI recommendations

---

# ADMIN FLOWS

## Flow 6: Admin Adds New Product with Multiple Variants

**Scenario**: Admin adds a new mixer grinder with 2 variants

### Steps:

1. **Admin Login**
   - Admin navigates to: `/admin`
   - Not logged in → Redirect to: `/login?returnUrl=/admin`
   - Admin enters phone number, verifies OTP
   - System checks: user.role = 'ADMIN' ✓
   - Redirect to: `/admin/dashboard`

2. **Navigate to Products**
   - Admin clicks: "Products" in sidebar
   - Navigate to: `/admin/products`
   - Page shows: Product list table (existing products)

3. **Initiate Add Product**
   - Admin clicks: "Add New Product" button
   - Navigate to: `/admin/products/new`
   - Empty form loads

4. **Fill Basic Information**
   - Product Name: "Bajaj Rex Mixer Grinder 750W"
   - Brand: Selects "Bajaj" from dropdown
   - Category: Selects "Electronics > Mixer Grinder > 3 Jar" (hierarchical selector)
   - Description: Types detailed description (multi-paragraph)
   - Search Keywords: "mixer, grinder, bajaj, 750w, kitchen, blending"
   - Base Price: ₹3200
   - Status: Selects "Active" (radio button)
   - Is Featured: Checks checkbox ✓

5. **Upload Product Images**
   - Drag-drop zone: Admin drags 5 image files
   - Upload starts (progress bars shown)
   - API: POST /api/upload → S3 URLs returned
   - Images appear as thumbnails below
   - Admin clicks radio button on first image → Sets as Primary
   - Assigns display order: 1, 2, 3, 4, 5 (or drag to reorder)

6. **Add First Variant (Standard)**
   - Variant section shows: "No variants added" initially
   - Admin clicks: "Add New Variant" button
   - Variant form appears:
     - Variant Name: "Standard"
     - SKU: Auto-suggested "BAJ-REX-750W" (admin can edit)
     - MRP: ₹4000
     - Selling Price: ₹3200
     - Discount auto-calculated: 20% OFF (shown in green)
     - Stock Quantity: 50
     - Attributes: Admin clicks "Add Attribute"
       - Key: "power", Value: "750W" (add)
       - Key: "jars", Value: "3" (add)
       - Key: "warranty", Value: "2 years" (add)
     - Status: Active (selected)
     - Is Default Variant: Checkbox checked ✓

7. **Add Second Variant (Premium)**
   - Admin clicks: "Add Another Variant" button
   - Second variant form appears:
     - Variant Name: "Premium 900W"
     - SKU: "BAJ-REX-900W"
     - MRP: ₹5000
     - Selling Price: ₹4200
     - Discount: 16% OFF
     - Stock Quantity: 30
     - Attributes: 
       - power: "900W", jars: "4", warranty: "3 years"
     - Status: Active
     - Is Default Variant: Unchecked (only first variant is default)

8. **Validate Form**
   - System checks:
     - Product name filled ✓
     - At least one variant ✓
     - All required variant fields filled ✓
     - SKUs unique ✓ (checks against database)
     - Selling price ≤ MRP for both variants ✓
   - All validations pass

9. **Publish Product**
   - Admin clicks: "Publish" button
   - Loading state shown
   - API call: POST /api/admin/products (sends entire product + variants + images)
   - Success response received
   - Success toast: "Product published successfully"
   - Redirect to: `/admin/products` (product list)

10. **Verify in Product List**
    - New product appears at top of list (sorted by newest)
    - Shows: Image, "Bajaj Rex Mixer Grinder 750W", Bajaj brand, 2 variants, Active status

**Alternative Paths**:
- **Validation fails (selling > MRP)**: Show error, highlight field, prevent save
- **SKU already exists**: Show error "SKU already in use", admin must change
- **Image upload fails**: Show error per image, allow retry or remove failed image
- **Save as Draft**: Admin clicks "Save as Draft" instead → Status = DRAFT, not visible to users

---

## Flow 7: Admin Edits Product Price Inline

**Scenario**: Admin quickly updates selling price from product list

### Steps:

1. **Navigate to Product List**
   - Admin at: `/admin/products`
   - Sees table with all products

2. **Identify Product to Update**
   - Admin finds: "Prestige Deluxe Alpha 2L" in list
   - Current prices shown: MRP ₹3000, Selling ₹2500

3. **Click to Edit Selling Price**
   - Admin clicks on selling price cell (₹2500)
   - Cell converts to input field (inline edit)
   - Input is focused and editable

4. **Update Price**
   - Admin changes: ₹2500 → ₹2300
   - Presses: Enter key (or clicks checkmark icon)
   - Validation: 2300 < 3000 (MRP) ✓
   - Loading indicator shows on that cell

5. **Save Price Update**
   - API call: PATCH /api/admin/products/:id/price { selling_price: 2300 }
   - Success response
   - Cell updates to show: ₹2300 (no longer editable)
   - Discount percentage auto-updates: 23% OFF (was 16%)
   - Subtle success indicator (green flash or checkmark)

**Alternative Paths**:
- **Invalid price (selling > MRP)**: Show inline error "Cannot exceed MRP (₹3000)", revert to original
- **API error**: Show error toast, revert to original value
- **Admin presses Escape**: Cancel edit, revert to original

---

## Flow 8: Admin Creates Homepage Banner

**Scenario**: Admin creates promotional banner for Prestige brand sale

### Steps:

1. **Navigate to Banners**
   - Admin clicks: "Banners" in sidebar
   - Navigate to: `/admin/banners`
   - Page shows: Existing banners list (if any)

2. **Initiate Add Banner**
   - Admin clicks: "Add New Banner" button
   - Navigate to: `/admin/banners/new`
   - Empty form loads

3. **Fill Banner Details**
   - Title: "Prestige Brand Sale 2025" (internal reference)
   - Banner Image:
     - Admin clicks upload zone
     - Selects image file: "prestige-sale-banner.jpg" (1920x600)
     - Upload to S3
     - Preview shows uploaded banner image
   - Click Action:
     - Admin selects radio button: "Link to Brand"
     - Brand dropdown appears
     - Admin selects: "Prestige" from dropdown
   - Display Order: 1 (will be first banner in carousel)
   - Status: Active (selected)

4. **Save Banner**
   - Admin clicks: "Save" button
   - Validation: Title, image, click action all filled ✓
   - API call: POST /api/admin/banners
   - Success response
   - Success toast: "Banner created successfully"
   - Redirect to: `/admin/banners` (banner list)

5. **Verify Banner in List**
   - New banner appears in list
   - Shows: Preview image, Title, Action "Brand: Prestige", Order: 1, Status: Active

6. **Test on Homepage (User View)**
   - Admin opens new tab
   - Navigate to: `/` (homepage)
   - Banner carousel shows new banner as first slide
   - Admin clicks banner
   - Navigates to: `/products?brand=prestige` (all Prestige products)

**Alternative Path - Link to Category Instead**:
- In step 3, admin selects: "Link to Category"
- Selects category: "Mixer Grinder" from hierarchical dropdown
- Clicking banner navigates to: `/categories/mixer-grinder`

---

## Flow 9: Admin Manages Category Hierarchy

**Scenario**: Admin creates new subcategory under existing category

### Steps:

1. **Navigate to Categories**
   - Admin at: `/admin/categories`
   - Sees: Tree view or table of existing categories
   - Existing: Electronics (Level 0) → Mixer Grinder (Level 1)

2. **Add New Sub-subcategory**
   - Admin clicks: "Add New Category" button
   - Navigate to: `/admin/categories/new`

3. **Fill Category Form**
   - Category Name: "4 Jar Mixer"
   - Slug: Auto-filled "4-jar-mixer" (from name)
   - Parent Category: Selects "Electronics > Mixer Grinder" from dropdown
   - Description: "Four jar mixer grinders for versatile grinding needs"
   - Display Order: 2
   - Category Image: Uploads image "4-jar-mixer.jpg"
   - Status: Active

4. **Auto-Calculated Fields**
   - System calculates:
     - Level: 2 (parent "Mixer Grinder" is Level 1, so this is 1+1=2)
     - Path: "/electronics/mixer-grinder/4-jar-mixer/"

5. **Validate and Save**
   - Validation:
     - Name filled ✓
     - Slug unique ✓
     - Parent selected level (1) + 1 = 2 (within max level 2) ✓
   - Admin clicks: "Save"
   - API call: POST /api/admin/categories
   - Success response
   - Redirect to: `/admin/categories`

6. **Verify in Category List**
   - Tree view shows:
     ```
     Electronics (Level 0)
       └─ Mixer Grinder (Level 1)
            ├─ 3 Jar (Level 2)
            └─ 4 Jar Mixer (Level 2) ← New
     ```

7. **Verify on User-Facing Site**
   - Navigate to: `/categories/mixer-grinder`
   - Shows subcategory cards: "3 Jar", "4 Jar Mixer"
   - Both clickable

**Alternative Path - Prevent Invalid Depth**:
- If admin tries to add category under Level 2 category
- System detects: Parent level (2) + 1 = 3 (exceeds max level 2)
- Show error: "Cannot create category. Maximum hierarchy depth is 3 levels."
- Disable save button

---

## Flow 10: Admin Views Analytics Dashboard

**Scenario**: Admin checks basic analytics (Phase 1)

### Steps:

1. **Navigate to Dashboard**
   - Admin logs in → Lands on `/admin/dashboard` OR
   - Admin clicks "Dashboard" in sidebar

2. **View Summary Cards**
   - Dashboard loads
   - Top section shows 4 cards:
     - Total Active Products: 87
     - Total Categories: 15
     - Total Users: 342
     - Total Wishlist Items: 156

3. **View Top Products Table**
   - Section title: "Top Viewed Products"
   - Table shows:
     ```
     Rank | Product Name                        | Views | Last Viewed
     1    | Prestige Deluxe Alpha 3L           | 1,234 | 2 hours ago
     2    | Bajaj Rex Mixer Grinder            | 987   | 1 hour ago
     3    | Preethi Blue Leaf Diamond          | 756   | 30 mins ago
     ...
     10   | Hawkins Pressure Cooker            | 234   | 1 day ago
     ```
   - Sortable by: Views (default), Last Viewed

4. **View Recent Activity**
   - Section: "Recently Added Products"
   - List shows last 10 products with add date
   - Section: "Recent User Registrations"
   - List shows last 10 users with join date

5. **Navigate to Detailed Views**
   - Admin clicks product name in Top Products table
   - Opens product edit page in new tab
   - Returns to dashboard

**Phase 2 Enhancements** (not shown in Phase 1):
- Line charts for trends
- Date range selectors
- Export reports
- Category performance breakdown

---

# ERROR HANDLING FLOWS

## Flow 11: Network Error During Product Load

**Scenario**: User tries to view product but API fails

### Steps:

1. User clicks product tile
2. Navigate to product detail page
3. Loading skeleton shown
4. API call: GET /api/products/:id → **Network Error** (timeout, 500 error, etc.)
5. Error state shown:
   - Message: "Unable to load product. Please check your connection."
   - Icon: Sad face or error icon
   - Button: "Try Again"
6. User clicks "Try Again"
7. API call retried → Success
8. Product page loads normally

**Alternative**: User clicks browser back button → Returns to previous page

---

## Flow 12: Session Expiry During Wishlist Action

**Scenario**: User's session expires while browsing

### Steps:

1. User logged in and browsing products
2. Session expires (30 days inactivity or token expired)
3. User clicks "Add to Wishlist"
4. API call: POST /api/wishlist → **401 Unauthorized** (invalid token)
5. System detects: Session invalid
6. Show toast: "Your session has expired. Please log in again."
7. Redirect to: `/login?returnUrl=[current-page]`
8. User logs in again
9. Redirect back to product page
10. User clicks "Add to Wishlist" again → Success

---

# NAVIGATION FLOWS SUMMARY

## Quick Reference: Page Transitions

```
Homepage (/)
  ├─> Category Page (/categories/[slug])
  │     ├─> Subcategory Page (/categories/[sub-slug])
  │     │     └─> Product Grid (if no more subcategories)
  │     └─> Product Grid (if no subcategories)
  │           └─> Product Detail (/products/[slug])
  │
  ├─> Search Results (/search?q=[query])
  │     └─> Product Detail (/products/[slug])
  │
  ├─> Login (/login)
  │     └─> Returns to previous page (returnUrl)
  │
  └─> Wishlist (/wishlist) [Auth Required]
        └─> Product Detail (/products/[slug])

Admin Routes (/admin/*)
  ├─> Dashboard (/admin/dashboard)
  ├─> Products (/admin/products)
  │     ├─> Add Product (/admin/products/new)
  │     └─> Edit Product (/admin/products/[id]/edit)
  ├─> Categories (/admin/categories)
  │     ├─> Add Category (/admin/categories/new)
  │     └─> Edit Category (/admin/categories/[id]/edit)
  └─> Banners (/admin/banners)
        ├─> Add Banner (/admin/banners/new)
        └─> Edit Banner (/admin/banners/[id]/edit)
```

---

**End of User Flows** - Use these flows to understand complete user journeys and implement proper state management, error handling, and navigation.
