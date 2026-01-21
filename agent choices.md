# AGENT DESIGN CHOICES & DECISIONS

This document tracks all design decisions, technical choices, and important patterns to maintain consistency throughout the project.

---

## 1. DESIGN SYSTEM (Step 2)

### 1.1 Color Palette

| Role | Color | Hex | HSL | Usage |
|------|-------|-----|-----|-------|
| **Primary** | Deep Teal | `#0F766E` | `167 65% 26%` | Brand color, headers, navigation, links, focus rings |
| **Primary Foreground** | White | `#FFFFFF` | `0 0% 100%` | Text on primary background |
| **Accent** | Warm Amber | `#F59E0B` | `38 92% 50%` | CTAs, discount badges, highlights, sale indicators |
| **Accent Foreground** | Near Black | `#171717` | `0 0% 9%` | Text on accent background |
| **Success** | Green | `#22C55E` | `142 71% 45%` | Success messages, discount percentages |
| **Destructive** | Red | `#EF4444` | `0 84% 60%` | Errors, delete buttons, warnings |
| **Warning** | Amber | `#F59E0B` | `38 92% 50%` | Warning messages |

#### Why These Colors?
- **Teal**: Professional, trustworthy, commonly used in home goods/appliances stores. Not as common as blue, making the brand more distinctive.
- **Amber**: Warm, inviting, draws attention naturally. Perfect for CTAs and discount indicators without being aggressive like red.
- **Green for discounts**: Industry standard - users expect green to indicate savings.

### 1.2 Neutral Palette

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#FFFFFF` | Page background |
| Foreground | `#171717` | Primary text |
| Muted | `#F5F5F5` | Secondary backgrounds, disabled states |
| Muted Foreground | `#737373` | Secondary text, placeholders |
| Border | `#E5E5E5` | Borders, dividers |

### 1.3 Brand Color Scales
Full teal and amber color scales are available for nuanced usage:
- `brand-teal-50` to `brand-teal-900`
- `brand-amber-50` to `brand-amber-900`

Use lighter shades for backgrounds, darker for emphasis.

---

### 1.4 Typography

#### Font Stack: System Fonts
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", 
             sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
```

#### Why System Fonts?
1. **Zero load time** - Fonts are already on user's device
2. **Native look** - Feels familiar on each platform
3. **Performance** - No network requests for font files
4. **Easy customization** - Can switch to custom fonts later by changing one variable
5. **Accessibility** - Users' system font preferences are respected

#### Font Size Scale (Tailwind defaults)
| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 0.75rem (12px) | Captions, badges |
| `text-sm` | 0.875rem (14px) | Secondary text, labels |
| `text-base` | 1rem (16px) | Body text |
| `text-lg` | 1.125rem (18px) | Subheadings |
| `text-xl` | 1.25rem (20px) | Product names, prices |
| `text-2xl` | 1.5rem (24px) | Section headings |
| `text-3xl` | 1.875rem (30px) | Page titles |
| `text-4xl` | 2.25rem (36px) | Hero text |

---

### 1.5 Spacing & Layout

#### Border Radius
| Variable | Value | Usage |
|----------|-------|-------|
| `--radius` | 0.5rem (8px) | Base radius |
| `radius-sm` | 4px | Small buttons, badges |
| `radius-md` | 6px | Inputs, small cards |
| `radius-lg` | 8px | Cards, modals |
| `radius-xl` | 12px | Large containers |

#### Container
- Max width: 1280px
- Padding: 1rem (mobile) → 1.5rem (tablet) → 2rem (desktop)
- Utility class: `.container-main`

---

### 1.6 Custom Utility Classes

| Class | Purpose |
|-------|---------|
| `.price-selling` | Large, bold selling price |
| `.price-mrp` | Strikethrough MRP |
| `.price-discount` | Green discount percentage |
| `.container-main` | Centered container with responsive padding |

---

### 1.7 Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Dark Mode | Not implemented (Phase 1) | Simpler, faster development |
| Font Loading | System fonts | Zero load time, best performance |
| Color Format | HSL in CSS variables | Works with shadcn/ui, easy to modify opacity |
| Configuration | CSS-first (Tailwind v4) | No separate config file, everything in globals.css |
| Focus Styles | 2px teal outline | Consistent, accessible |
| Transitions | 150ms ease-in-out | Smooth but quick |

---

## 2. COMPONENT PATTERNS (To be updated in subsequent steps)

### shadcn/ui Components Used
- Button, Input, Card, Badge, Avatar, Dialog, Sheet
- Dropdown-menu, Accordion, Sonner (toast)
- Carousel, Skeleton, Separator, Label, Textarea, Select, Checkbox

### Custom Component Conventions

#### Layout Components (Step 3)
| Component | Purpose | Location |
|-----------|---------|----------|
| `Header` | Main navigation with search, logo, user menu | `components/layout/Header.tsx` |
| `Footer` | Store info, contact, quick links | `components/layout/Footer.tsx` |
| `MobileNav` | Slide-out drawer for mobile navigation | `components/layout/MobileNav.tsx` |
| `MainLayout` | Wraps user pages with Header + Footer | `components/layout/MainLayout.tsx` |

#### Header Design Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Sticky Header | Yes | Easy access to search/nav while scrolling |
| Mobile Layout | Two-row | Row 1: menu, logo, icons. Row 2: full-width search |
| Category Menu | Not in header | Categories shown on homepage only (Phase 1) |
| Shadow on Scroll | Yes | Visual feedback that content scrolls behind |
| Announcement Bar | No | Not needed for Phase 1 |
| WhatsApp Button | No | Not needed for Phase 1 |

#### Mobile Navigation Features
- Opens from left side (Sheet component)
- Shows user profile section (login status)
- Lists main categories with navigation
- Quick links: Home, Wishlist, Profile, Orders
- Admin link visible for admin users
- Store contact info at bottom

#### Home Components (Step 5)
| Component | Purpose | Location |
|-----------|---------|----------|
| `HeroBanner` | Autoplay carousel with banners | `components/home/HeroBanner.tsx` |
| `CategoryGrid` | Grid of category cards | `components/home/CategoryGrid.tsx` |
| `ProductCard` | Reusable product tile | `components/home/ProductCard.tsx` |
| `FeaturedProducts` | Grid of featured products | `components/home/FeaturedProducts.tsx` |
| `StoreInfo` | Store contact and info section | `components/home/StoreInfo.tsx` |

#### ProductCard Design Decisions
| Element | Styling |
|---------|--------|
| Discount Badge | Top-left, amber background |
| Wishlist Button | Top-right, heart icon, toggles |
| Brand Name | Uppercase, small, gray |
| Product Title | 2-line clamp, hover changes color |
| Rating | Star icon + number + review count |
| Price | Selling price bold, MRP strikethrough |

#### Responsive Grid Columns
| Component | xs (default) | sm (640px) | md (768px) | lg (1024px) |
|-----------|--------------|------------|------------|-------------|
| Categories | 2 | 3 | 4 | 6 |
| Products | 2 | 2 | 3 | 4 |

#### Category Navigation (Step 6)
| Component | Purpose | Location |
|-----------|---------|----------|
| `Breadcrumb` | Navigation trail with clickable links | `components/common/Breadcrumb.tsx` |
| `CategoryGrid` | Homepage category grid with nested drill-down | `components/home/CategoryGrid.tsx` |

#### Category Drill-Down Behavior
| Action | Result |
|--------|--------|
| Click category WITH subcategories | Subcategories appear **below** main grid (nested) |
| Click same category again | Collapse the subcategories section |
| Click different category | Switch to new category's subcategories |
| Click category WITHOUT subcategories | Navigate to `/category/{slug}/products` |
| Click "View All Products" button | Navigate to `/category/{slug}/products` |

#### Category Selected State (Option E)
| State | Visual Styling |
|-------|----------------|
| Selected | `bg-primary/10 ring-2 ring-primary` - light teal background + teal border |
| Has children indicator | Chevron icon (▼) rotates 180° when expanded |
| Hover (unselected) | `hover:bg-gray-50` with text color change |

#### Nesting Levels
| Level | Behavior |
|-------|----------|
| Level 0 (Main) | Always visible, expandable |
| Level 1 (Sub) | Shown below Level 0 when parent expanded |
| Level 2 (Sub-sub) | Shown below Level 1, always navigates to products |

#### Product Detail Components (Step 8)
| Component | Purpose | Location |
|-----------|---------|----------|
| `ProductImageGallery` | Hybrid carousel/thumbnail gallery | `components/products/ProductImageGallery.tsx` |
| `VariantSelector` | Pill buttons for variant selection | `components/products/VariantSelector.tsx` |
| `ProductInfo` | Name, price, rating, wishlist | `components/products/ProductInfo.tsx` |
| `ProductAccordion` | Specs, delivery, returns | `components/products/ProductAccordion.tsx` |
| `RelatedProducts` | Horizontal product carousel | `components/products/RelatedProducts.tsx` |

#### Product Page Layout
| Section | Desktop | Mobile |
|---------|---------|--------|
| Image Gallery | Left column (50%) | Full width, top |
| Product Info | Right column, sticky | Below images |
| Related Products | Full width, below | Full width, bottom |

#### Variant URL Strategy
| Element | Format | Example |
|---------|--------|--------|
| Product URL | `/products/{product-slug}` | `/products/prestige-deluxe-alpha-pressure-cooker` |
| With Variant | `?variant={variant-slug}` | `?variant=3-litre` |
| Variant Slug | Lowercase, hyphenated | `750w-3-jar`, `5-litre` |

#### Infinite Scroll Configuration
| Setting | Value | Location |
|---------|-------|----------|
| Products per page | 30 | `NEXT_PUBLIC_PRODUCTS_PER_PAGE` in `.env.local` |
| Load trigger | 200px before end | Intersection Observer rootMargin |
| Implementation | SWR Infinite | `useInfiniteProducts` hook |

---

## 3. FILE STRUCTURE CONVENTIONS

```
store/src/
├── app/              # Pages (App Router)
│   └── category/[slug]/products/  # Category products page
├── components/       
│   ├── ui/          # shadcn/ui components (auto-generated)
│   ├── layout/      # Header, Footer, Nav (Step 3)
│   ├── home/        # Homepage components (Step 5)
│   └── common/      # Breadcrumb, shared components (Step 6)
├── context/         # React Context (Auth, etc.)
├── hooks/           # Custom hooks
├── lib/             # Utilities (api.ts, utils.ts)
├── mock_data/       # JSON mock data
└── types/           # TypeScript interfaces
```

---

## 4. API CONVENTIONS

### Response Format
All API endpoints follow a consistent response structure:

**Success Response:**
```json
{ "success": true, "data": {...} }
```

**Paginated Response:**
```json
{ 
  "success": true, 
  "data": [...],
  "pagination": { "currentPage", "totalPages", "totalItems", "hasNextPage", "hasPreviousPage" }
}
```

**Error Response:**
```json
{ "success": false, "error": "ERROR_CODE", "message": "Human-readable message" }
```

### Product Data Structure
Products use a two-level structure that gets flattened for list views:
- **ProductGroup**: Parent entity (name, description, brand, category, rating)
- **Product/Variant**: Child entity (SKU, prices, attributes like size/color)

List endpoints return `ProductListItem` (merged view), detail endpoints return full structure with all variants.

---

## 5. AUTHENTICATION PATTERNS (Step 9)

### 5.1 Login Page Design

| Element | Styling |
|---------|---------|
| Container | Centered card, max-width 448px |
| Background | `bg-secondary/30` subtle tint |
| Card | White background, shadow-lg, rounded-lg |
| Logo | Primary color, links to home |
| Footer | Terms & Privacy links |

### 5.2 Phone Input Design

| Element | Choice | Rationale |
|---------|--------|-----------|
| Country Code | Dropdown selector (editable) | Supports international users |
| Default | +91 (India) | Primary market |
| Input | Numeric only, max 15 digits | Prevents invalid input |
| Icon | Phone icon inside input | Visual clarity |

### 5.3 OTP Input Design

| Feature | Implementation |
|---------|---------------|
| Input Style | 6 individual boxes, 48x56px each |
| Auto-focus | First box on mount |
| Navigation | Arrow keys move between boxes |
| Paste | Supports pasting full OTP |
| Error State | Red border on all boxes |
| Disabled | Grayed out during verification |

### 5.4 Authentication Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth Method | Phone OTP | No password to remember, common in India |
| Token Storage | localStorage | Simple for mock, will migrate to httpOnly cookies |
| Token Format | Base64 JSON (mock JWT) | Easy to debug, real JWT in production |
| Token Expiry | 30 days | Reduce re-login friction |
| Session Check | On app mount | Immediate auth state resolution |

### 5.5 New User Flow

```
OTP Verified → isNewUser: true → Name Input Step → Profile API → Redirect
```

- First-time users must provide their name
- Name is saved via `PUT /api/auth/profile`
- User state updated with new name before redirect

### 5.6 Admin Detection

Admin role is determined by phone number:

| Phone | Role | User |
|-------|------|------|
| +919849067667 | ADMIN | Store owner |
| Any other | USER | Regular customer |

### 5.7 Form Validation

| Field | Validation |
|-------|------------|
| Phone | Required, 6-15 digits after country code |
| OTP | Required, exactly 6 digits |
| Name | Required, minimum 2 characters |

### 5.8 Loading & Error States

| State | UI Feedback |
|-------|-------------|
| Sending OTP | Button disabled, spinner, "Sending OTP..." |
| Verifying | Button disabled, spinner, "Verifying..." |
| OTP Resend | 30-second countdown, disabled state |
| Error | Red text below field, toast notification |
| Success | Toast notification, redirect |

---

## 6. IMPORTANT REMINDERS

- **Single source of truth**: All colors are in `globals.css` CSS variables
- **Mobile-first**: User pages designed for mobile, scaled up for desktop
- **Admin desktop-first**: Admin panel optimized for desktop editing
- **Performance**: Always consider loading time impact of decisions
- **Consistency**: Use design tokens, don't hardcode colors/sizes

---

*Last Updated: 2026-01-21 (Step 9: Authentication System)*
