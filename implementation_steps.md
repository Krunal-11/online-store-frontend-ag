# IMPLEMENTATION STEPS

This document tracks the implementation progress of the New Guru Enterprises online store.

**Status Legend**: ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

## Phase 1: Core Implementation

1. ✅ Project Setup and Configuration
2. ✅ Design System and Theme Setup
3. ✅ Layout Components (Header, Footer, Mobile Navigation)
4. ✅ Mock Data and API Routes
5. ✅ Homepage Implementation
6. ✅ Category Navigation and Pages
7. ⬜ Product Grid Component
8. ⬜ Product Detail Page
9. ⬜ Authentication System (Phone OTP Mock)
10. ⬜ Wishlist Functionality
11. ⬜ Search Functionality
12. ⬜ Admin Panel - Layout and Authentication
13. ⬜ Admin Panel - Category Management
14. ⬜ Admin Panel - Brand Management
15. ⬜ Admin Panel - Product Management
16. ⬜ Admin Panel - Banner Management
17. ⬜ Loading States and Error Handling
18. ⬜ Responsive Design Polish
19. ⬜ Performance Optimization
20. ⬜ Testing and Bug Fixes
21. ⬜ Deployment to Vercel

---

## Implementation Notes

### Step 1: Project Setup and Configuration ✅
**Completed**: 2025-12-17

**What was set up**:
- Next.js 14 with App Router, TypeScript, Tailwind CSS, ESLint
- Additional packages: SWR, axios, react-hook-form, zod, lucide-react, embla-carousel-react
- shadcn/ui initialized with components: button, input, card, badge, avatar, dialog, sheet, dropdown-menu, accordion, sonner, carousel, skeleton, separator, label, textarea, select, checkbox

**Folder Structure Created**:
```
store/src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── context/         # React Context providers (AuthContext)
├── hooks/           # Custom hooks (useProducts, useCategories, useWishlist)
├── lib/             # Utilities (api.ts with axios setup)
├── mock_data/       # JSON mock data files
│   ├── categories.json (5 main categories)
│   ├── brands.json (5 brands)
│   ├── products.json (20 products with variants)
│   ├── banners.json
│   └── users.json
└── types/           # TypeScript interfaces
```

**Configuration Files**:
- `.env.local` - Environment variables with admin credentials (admin/admin123)
- `next.config.ts` - Image optimization settings
- `components.json` - shadcn/ui configuration
- Path alias `@/*` → `./src/*`

**Note**: Git was initialized automatically by create-next-app. Delete `.git` folder if you want to initialize fresh with different credentials.

---

### Step 2: Design System and Theme Setup ✅
**Completed**: 2025-01-05

**What was set up**:
- Complete color palette with CSS custom properties
- Primary color: Deep Teal (#0F766E) - trust, professionalism
- Accent color: Warm Amber (#F59E0B) - CTAs, discounts
- Semantic colors: Success, Destructive, Warning
- Full teal and amber color scales (50-900)
- System font stack (zero load time, native look)
- shadcn/ui theme variables configured
- Custom utility classes for pricing display
- Smooth scrollbar styling
- Focus and selection styles
- Responsive container utility

**Files Modified**:
- `store/src/app/globals.css` - All design tokens and base styles
- `agent choices.md` - Documented all design decisions

**Key Decisions**:
- Light mode only for Phase 1
- CSS-first configuration (Tailwind v4 approach)
- HSL color format for compatibility with shadcn/ui
- Single source of truth - change CSS variables to update entire app

**Color Reference**:
| Role | Hex | Tailwind Class |
|------|-----|----------------|
| Primary | #0F766E | `bg-primary`, `text-primary` |
| Accent | #F59E0B | `bg-accent`, `text-accent` |
| Success | #22C55E | `bg-success`, `text-success` |
| Destructive | #EF4444 | `bg-destructive` |

---

### Step 3: Layout Components (Header, Footer, Mobile Navigation) ✅
**Completed**: 2025-01-05

**What was created**:

**Components Created** (`store/src/components/layout/`):
1. **Header.tsx** - Main navigation header
   - Sticky header with shadow on scroll
   - Desktop: Single row (logo, search, icons)
   - Mobile: Two rows (menu+logo+icons, search bar)
   - Integrated with AuthContext for user state
   - Wishlist count badge from useWishlist hook
   - User dropdown menu with profile/logout options
   - Admin panel link for admin users

2. **MobileNav.tsx** - Mobile slide-out drawer
   - Opens from left using Sheet component
   - User profile section (login status)
   - Main categories list with navigation
   - Quick links: Home, Wishlist, Profile, Orders
   - Admin link for admin users
   - Store contact info footer

3. **Footer.tsx** - Page footer
   - Store name and tagline
   - "Home Delivery Available" badge
   - Contact info (phone, address)
   - Quick links section
   - Copyright line

4. **MainLayout.tsx** - Layout wrapper
   - Wraps pages with Header + Footer
   - Flex layout for sticky footer

5. **index.ts** - Barrel export file

**Files Modified**:
- `store/src/app/layout.tsx` - Added AuthProvider, MainLayout, Toaster
- `store/src/app/page.tsx` - Updated with placeholder homepage content

**Key Design Decisions**:
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Header Position | Sticky | Easy access while scrolling |
| Mobile Header | Two-row | Full logo + full-width search |
| Category Menu | Not in header | Simpler, categories on homepage |
| Shadow on Scroll | Yes | Visual feedback for scrolling |
| Mobile Nav | Sheet from left | Natural thumb reach |

**Header Heights**:
- Desktop: 64px (single row)
- Mobile: ~110px (two rows: 56px + search row)

---

### Step 4: Mock Data and API Routes ✅
**Completed**: 2026-01-07

**What was created**:

**Utility File** (`store/src/lib/mock-helpers.ts`):
- `delay(ms)` - Artificial 200ms delay for realistic loading states
- `generateToken(userId)` / `verifyToken(token)` - Mock JWT token handling
- `getPlaceholderImage(text, w, h)` - Generate placeholder.co URLs
- `successResponse()` / `errorResponse()` - Standard API response helpers
- `paginate()` - Pagination utility for list endpoints

**API Routes Created** (`store/src/app/api/`):

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/send-otp` | POST | Mock OTP sending (always succeeds, logs to console) |
| `/api/auth/verify-otp` | POST | Accept any 6-digit OTP, return fixed mock user + token |
| `/api/auth/me` | GET | Get current user from token |
| `/api/auth/logout` | POST | Logout (frontend clears token) |
| `/api/categories` | GET | Get all categories (hierarchical tree) |
| `/api/categories/[slug]` | GET | Single category with subcategories + breadcrumb |
| `/api/products` | GET | List products with search, filters, pagination |
| `/api/products/[slug]` | GET | Product details with all variants |
| `/api/brands` | GET | List all brands |
| `/api/banners` | GET | Active homepage banners |
| `/api/wishlist` | GET/POST/DELETE | Wishlist operations (in-memory storage) |

**Key Implementation Decisions**:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth Mock | Fixed user for all logins | Simpler for Phase 1; real logic in Spring Boot later |
| Images | Placeholder URLs via placehold.co | App looks complete during development |
| API Delay | 200ms artificial delay | Test loading states realistically |
| Wishlist Storage | In-memory Map | Resets on restart; real DB in Phase 2 |
| Product Response | ProductGroups + Variants merged | Clean API for frontend consumption |

**Files Modified**:
- `store/src/types/index.ts` - Added optional fields to ProductListItem

**How to Test**:
```bash
cd store
npm run dev
# Then open browser console and test:
# fetch('/api/categories').then(r => r.json()).then(console.log)
# fetch('/api/products').then(r => r.json()).then(console.log)
# fetch('/api/products?search=prestige').then(r => r.json()).then(console.log)
```

**Notes**:
- All existing hooks (`useProducts`, `useCategories`, etc.) now have working endpoints
- Admin APIs will be implemented in Steps 12-16
- When switching to Spring Boot backend, change `NEXT_PUBLIC_API_URL` environment variable

---

### Step 5: Homepage Implementation ✅
**Completed**: 2026-01-14

**What was created**:

**Components Created** (`store/src/components/home/`):
1. **HeroBanner.tsx** - Hero carousel
   - Uses embla-carousel with autoplay plugin (5s interval)
   - Arrow navigation (desktop, visible on hover)
   - Dot indicators with click navigation
   - Responsive images: separate desktop/mobile versions
   - Skeleton loader during fetch

2. **CategoryGrid.tsx** - Category browsing section
   - Simple cards: image + name only
   - Responsive grid: 2→3→4→6 columns
   - Skeleton loaders for loading state
   - Links to /category/[slug]

3. **ProductCard.tsx** - Reusable product tile
   - Product image with hover zoom
   - Brand name, product title (2-line clamp)
   - Star rating with review count
   - Selling price + MRP strikethrough
   - Discount badge (amber)
   - Wishlist heart button (functional)

4. **FeaturedProducts.tsx** - Featured products section
   - Uses ProductCard in responsive grid
   - Grid: 2→3→4 columns
   - Skeleton loaders for loading state

5. **StoreInfo.tsx** - Store information section
   - Store name and tagline
   - "Home Delivery Available" badge
   - Clickable phone number
   - Address display

**New Hooks Created** (`store/src/hooks/`):
- `useBanners.ts` - Fetches active banners from /api/banners
- `useFeaturedProducts.ts` - Fetches featured products with limit param

**Key Implementation Decisions**:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Banner Autoplay | 5s with embla-carousel-autoplay | Simple integration, no pause-on-hover |
| Category Cards | Image + Name only | Clean, simple design per user request |
| Featured Products | Separate section below categories | Shows both categories AND products |
| Responsive Banners | Separate desktop/mobile images | Optimal aspect ratios for each device |
| Skeleton Loaders | Included | Simple to implement, better UX |
| Price Format | INR with Intl.NumberFormat | Proper Indian currency formatting |

**Responsive Breakpoints**:

| Component | Mobile (<640px) | Tablet (md) | Desktop (lg+) |
|-----------|-----------------|-------------|---------------|
| Hero Banner | 16:9 aspect, swipe | 21:7 aspect | 21:7 + arrows |
| Category Grid | 2 cols | 3-4 cols | 6 cols |
| Products Grid | 2 cols | 3 cols | 4 cols |

**Dependencies Added**:
- `embla-carousel-autoplay` - For banner autoplay functionality

---

### Step 6: Category Navigation and Pages ✅
**Completed**: 2026-01-20

**What was created**:

**Components Created**:
1. **Breadcrumb.tsx** (`store/src/components/common/`)
   - Simple text breadcrumb with chevron separators
   - Clickable links for navigation
   - Last item shown as non-clickable current page

2. **CategoryGrid.tsx** (Modified - `store/src/components/home/`)
   - Added drill-down functionality for subcategories
   - Click category with subcategories → Shows subcategories in same section
   - Click category without subcategories → Navigates to products page
   - Back button to return to parent/main categories
   - "View All Products in {Category}" button

**Pages Created**:
1. **Category Products Page** (`store/src/app/category/[slug]/products/page.tsx`)
   - Breadcrumb navigation at top
   - Category title with product count
   - Infinite scroll product grid
   - Empty state for categories with no products
   - Loading skeleton during initial load

**Hooks Created**:
1. **useInfiniteProducts.ts** (`store/src/hooks/`)
   - SWR Infinite for paginated product fetching
   - Intersection Observer for automatic loading
   - Configurable page size via environment variable
   - Returns products, loading states, hasMore, loadMore

**Files Modified**:
- `store/.env.local` - Added `NEXT_PUBLIC_PRODUCTS_PER_PAGE=30`
- `store/src/hooks/useCategories.ts` - Updated `useCategory` to return subcategories + breadcrumb
- `store/src/hooks/index.ts` - Export new hook

**Key Implementation Decisions**:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Category Drill-down | Nested below main grid | Main categories always visible, subcategories appear below |
| Selected Indicator | Teal border + light background (Option E) | Clear visual cue, matches design theme |
| Collapse Behavior | Click same category to collapse | Intuitive toggle behavior |
| Nesting Depth | 3 levels max (0, 1, 2) | Fixed depth, simple state management |
| Products Page | Separate route `/category/[slug]/products` | Clean URL, proper page for product listings |
| Infinite Scroll | Intersection Observer with 200px margin | Loads before user reaches end, smooth UX |
| Pagination Config | Environment variable | Easy to change globally |
| Empty State | Dedicated component | Good UX, clear messaging |

**URL Structure**:
- Category products: `/category/{slug}/products`
- Flat slug-only (not nested paths)

**Flow**:
1. Homepage → Browse by Category grid (Level 0 always visible)
2. Click category WITH subcategories → Level 1 subcategories appear below with "View All" button
3. Click Level 1 WITH subcategories → Level 2 subcategories appear below
4. Click same category again → Collapse that level
5. Click category WITHOUT subcategories → Navigate to `/category/{slug}/products`
6. Products page → Breadcrumb, title, infinite scroll grid