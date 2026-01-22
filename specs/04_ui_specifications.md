UI/UX design specifications, component layouts, and responsive behavior - reference this for implementing visual design and interactions.

**Last Updated**: 2026-01-22 (Updated to reflect Phase 1 implementation through Step 9)

---

# UI SPECIFICATIONS

## How to Use This Document

This document defines:
- Visual design system (colors, typography, spacing)
- Component layouts and structure
- Responsive breakpoints and behavior
- Page-specific UI patterns
- Accessibility considerations

---

# DESIGN SYSTEM (IMPLEMENTED)

## Color Palette

**Implemented Choice**: Deep Teal and Warm Amber theme for trust and professionalism

### Primary Colors (Implemented)
```
Primary Teal:     #0F766E  (HSL: 167 65% 26%) - Brand color, headers, links
Primary Hover:    #0D6560  (Darker teal for hover states)
Primary Light:    #CCFBF1  (Teal 100 for backgrounds)
Primary Foreground: #FFFFFF (Text on primary background)
```

### Accent Colors (Implemented)
```
Accent Amber:     #F59E0B  (HSL: 38 92% 50%) - CTAs, discount badges
Accent Hover:     #D97706  (Darker amber for hover)
Accent Light:     #FEF3C7  (Amber 100 for backgrounds)
Accent Foreground: #171717 (Text on accent background)
```

### Semantic Colors (Implemented)
```
Success Green:  #22C55E  (Discount percentages, success messages)
Warning Amber:  #F59E0B  (Warnings)
Error Red:      #EF4444  (Errors, delete actions)
```

### Neutral Colors (Implemented)
```
Background:       #FFFFFF  (Page background)
Foreground:       #171717  (Primary text)
Muted:            #F5F5F5  (Secondary backgrounds)
Muted Foreground: #737373  (Secondary text, placeholders)
Border:           #E5E5E5  (Borders, dividers)
```

### Brand Color Scales (Available)
Full teal and amber color scales (50-900) defined in CSS:
- `brand-teal-50` to `brand-teal-900`
- `brand-amber-50` to `brand-amber-900`

**Rationale for Change from Original Blue/Orange Spec**:
- Teal (#0F766E) chosen over Blue (#2563EB) for more distinctive brand identity
- Amber (#F59E0B) provides warmer, inviting feel
- Green (#22C55E) for discounts - industry standard
- All colors defined in `globals.css` as CSS custom properties (HSL format)

---

## Typography (IMPLEMENTED)

### Font Stack: System Fonts Only
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", 
             sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
```

**Rationale for System Fonts** (changed from Inter/Google Fonts):
1. ✅ Zero load time - fonts already on user's device
2. ✅ Native look - feels familiar on each platform
3. ✅ Performance - no network requests for font files
4. ✅ Easy customization - can switch later by changing one variable
5. ✅ Accessibility - respects users' system font preferences
- Automatically optimizes font loading

### Font Sizes & Line Heights
```
Headings:
  h1: 2.25rem (36px) / Line: 2.5rem  - Page titles
  h2: 1.875rem (30px) / Line: 2.25rem - Section headers
  h3: 1.5rem (24px) / Line: 2rem     - Card titles
  h4: 1.25rem (20px) / Line: 1.75rem - Small headings
  h5: 1.125rem (18px) / Line: 1.75rem

Body:
  Large:   1.125rem (18px) / Line: 1.75rem - Hero text, important content
  Base:    1rem (16px) / Line: 1.5rem     - Default body text
  Small:   0.875rem (14px) / Line: 1.25rem - Captions, helper text
  Tiny:    0.75rem (12px) / Line: 1rem    - Labels, badges

Buttons:
  Large:   1.125rem (18px) / Weight: 600
  Default: 1rem (16px) / Weight: 500
  Small:   0.875rem (14px) / Weight: 500
```

### Font Weights
```
Light:    300 (Rarely used)
Regular:  400 (Body text)
Medium:   500 (Buttons, emphasis)
Semibold: 600 (Headings, strong emphasis)
Bold:     700 (Headings, pricing)
```

---

## Spacing & Layout

### Spacing Scale (Tailwind-compatible)
```
0.5: 0.125rem (2px)   - Minimal spacing
1:   0.25rem (4px)    - Tight spacing
2:   0.5rem (8px)     - Small gaps
3:   0.75rem (12px)
4:   1rem (16px)      - Standard spacing
5:   1.25rem (20px)
6:   1.5rem (24px)    - Section spacing
8:   2rem (32px)      - Large gaps
10:  2.5rem (40px)
12:  3rem (48px)      - Major sections
16:  4rem (64px)      - Page sections
```

### Container Widths
```
Mobile:     100% (no fixed width)
Tablet:     768px max-width
Desktop:    1280px max-width
Wide:       1536px max-width (optional for very large screens)

Padding:
Mobile:     16px (1rem) horizontal
Tablet:     24px (1.5rem) horizontal
Desktop:    32px (2rem) horizontal
```

### Responsive Breakpoints
```
Mobile:       < 640px   (sm)
Tablet:       640px+    (md: 768px+)
Desktop:      1024px+   (lg)
Large:        1280px+   (xl)
X-Large:      1536px+   (2xl)
```

**Implementation**: Use Tailwind's default breakpoints or define custom

---

## Border Radius

```
None:    0
Small:   0.25rem (4px)   - Buttons, badges
Default: 0.375rem (6px)  - Cards, inputs
Medium:  0.5rem (8px)    - Large cards
Large:   0.75rem (12px)  - Modals, drawers
XL:      1rem (16px)     - Hero sections
Full:    9999px          - Pills, circular buttons
```

---

## Shadows

```
Small:    0 1px 2px rgba(0,0,0,0.05)           - Subtle elevation
Default:  0 1px 3px rgba(0,0,0,0.1),           - Cards
          0 1px 2px rgba(0,0,0,0.06)
Medium:   0 4px 6px rgba(0,0,0,0.07),          - Dropdown menus
          0 2px 4px rgba(0,0,0,0.06)
Large:    0 10px 15px rgba(0,0,0,0.1),         - Modals, drawers
          0 4px 6px rgba(0,0,0,0.05)
XL:       0 20px 25px rgba(0,0,0,0.1),         - Sticky headers
          0 10px 10px rgba(0,0,0,0.04)
```

---

# COMPONENT SPECIFICATIONS

## 1. Header / Navigation Bar

### Desktop Header (1024px+)

**Layout**:
```
## 1. Header / Navigation Bar (IMPLEMENTED)

### Desktop Header (1024px+)

**Layout** (Implemented):
```
┌──────────────────────────────────────────────────────────────┐
│ [Logo]      [Search Bar......................]  [Wishlist] [Login/Profile ▼] │
│  New Guru                                          ♥         Hi, User          │
└──────────────────────────────────────────────────────────────┘
```

**Specifications** (Implemented):
- Height: 64px (4rem)
- Background: White (#FFFFFF)
- Border Bottom: 1px solid border color
- **Sticky**: Yes - stays at top when scrolling (position: sticky, top: 0, z-index: 50)
- Box Shadow: Appears when scrolled past threshold

**Components** (Implemented):

1. **Logo**
   - Position: Left
   - Text: "New Guru" (styled brand name)
   - Font: h4 size, Semibold, Primary teal color
   - Clickable → Navigate to homepage

2. **Categories Dropdown** - **NOT IMPLEMENTED**
   - Categories shown on homepage only (simplified design decision)
   - Removes complexity from header

3. **Search Bar** (Implemented)
   - Centered, flexible width
   - Height: 40px
   - Background: Gray 100
   - Border: 1px solid border (focus: Primary teal)
   - Border radius: Full (pill shape)
   - Placeholder: "Search for products..."
   - Icon: Search icon on right side
   - On Enter → Navigate to search results (to be implemented in Step 11)

4. **Wishlist Icon** (Implemented)
   - Icon: Heart outline
   - Click → Navigate to /wishlist (or login if not authenticated)
   - Badge: Not yet implemented (Phase 1 wishlist step pending)

5. **User Menu** (Implemented)
   - If NOT logged in: "Login" text button with User icon
   - If logged in: 
     - "Hi, [First Name]" with User icon
     - Dropdown on click:
       - Wishlist
       - Logout
       - Admin Panel (if admin user)

### Mobile Header (< 768px) (IMPLEMENTED)

**Layout** (Implemented - Two-row design):
```
┌────────────────────────────────────┐
│ [☰]  New Guru Enterprises  [♥] [👤] │  ← Row 1 (56px)
├────────────────────────────────────┤
│ [Search Bar (full width)........]  │  ← Row 2 (search)
└────────────────────────────────────┘
```

**Specifications** (Implemented):
- Total Height: ~110px (two rows)
- Row 1: 56px - Menu, logo, icons
- Row 2: Full-width search bar
- Sticky: Yes
- Background: White, shadow when scrolled

**Rationale for Two-Row Mobile Layout**:
- Full logo visibility
- Full-width search bar (easier to tap)
- Better UX for primary search use case

**Components** (Implemented):

1. **Hamburger Menu** (☰)
   - Left side, opens MobileNav Sheet
   - Sheet slides from LEFT (natural thumb reach)

2. **Logo/Brand Name**
   - Center
   - Full store name: "New Guru Enterprises"

3. **Icon Group** (Right side)
   - Wishlist icon (heart)
   - User icon → Login page or profile menu

4. **Search Bar** (Row 2)
   - Full width below header row
   - Same styling as desktop

### Mobile Navigation Drawer (IMPLEMENTED)

**Implementation**: shadcn/ui Sheet component

**Contents**:
- User profile section (shows logged-in status)
- Category list with navigation
- Quick links: Home, Wishlist, Profile, Orders
- Admin Panel link (visible for admin users)
- Store contact info at bottom

---

## 2. Footer (IMPLEMENTED)

### Desktop Footer

**Layout**:
```
┌────────────────────────────────────────────────────────────────┐
│  NEW GURU ENTERPRISES                                          │
│  Wide Range of home appliances and kitchenware                 │
│  🏠 Home delivery available                                    │
│                                                                 │
│  📍 Address:                         📞 Contact:               │
│  No. 5-4-726/1, Nampally            Phone: 9849067667         │
│  Station Road ABIDS SOUTH            Email: (if available)     │
│  Hyderabad, Telangana, 500001                                  │
│                                                                 │
│  Links:  About | Contact | Privacy Policy                      │
│                                                                 │
│  © 2025 New Guru Enterprises. All rights reserved.            │
└────────────────────────────────────────────────────────────────┘
```

**Specifications**:
- Background: Gray 900 (Dark)
- Text color: White / Gray 300
- Padding: 48px vertical, 32px horizontal
- Border top: None or subtle accent

**Sections**:
1. Brand message (large text, centered or left)
2. Two-column layout: Address | Contact
3. Links row (center aligned)
4. Copyright (small text, center, Gray 400)

### Mobile Footer
- Stack sections vertically
- Center-aligned text
- Padding: 32px vertical, 16px horizontal
- Phone number as clickable tel: link

---

## 3. Product Tile (Grid Item)

### Desktop Tile (256px width recommended)

**Layout**:
```
┌──────────────────────┐
│                      │
│    Product Image     │ ← 1:1 aspect ratio (square)
│                      │
├──────────────────────┤
│ Brand Name           │ ← Gray 500, small text
│ Product Name Here... │ ← 2 lines max, ellipsis
│ ★★★★☆ (120)         │ ← Gold stars, gray count
│ ₹3000  ₹2500        │ ← Strikethrough, bold
│ [16% OFF]            │ ← Orange badge
└──────────────────────┘
```

**Image Research**: 
- **Best Practice**: Square (1:1) aspect ratio for consistency in grid
- Allows equal-height rows, easier responsive layout
- If product images aren't square: Use object-fit: cover with center cropping

**Specifications**:
- Container: Background White, border 1px Gray 200, border-radius default
- Hover: Shadow-medium, subtle scale (1.02), border Primary Teal
- Cursor: Pointer on entire card
- Image: 100% width, aspect-ratio 1/1, object-fit cover
- Padding inside card: 12px

**Text Elements**:
1. **Brand**: Font-small, Gray 500, margin-bottom 4px
2. **Product Name**: Font-base, Gray 900, Semibold, 2 lines with ellipsis (line-clamp-2)
3. **Rating**: Flex row, gold stars (★), gray text for count, margin 8px vertical
4. **Pricing**: 
   - MRP: Gray 400, strikethrough, font-base
   - Selling Price: Gray 900, Bold, font-lg (1.125rem)
   - Space between: 8px
5. **Discount Badge**: 
   - Background: Accent Light (amber tint)
   - Text: Accent Amber, Semibold, font-small
   - Padding: 4px 8px, border-radius small
   - Position: Below prices OR top-right corner of image (floating)

### Mobile Tile (50% width - 2 columns)

**Adjustments**:
- Smaller text: Product name font-small
- Prices font-base (not large)
- Rating stars smaller
- Less padding: 8px

---

## 4. Product Detail Page Layout

### Desktop Layout (1024px+)

**Two-Column Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Category > Product                       │
├───────────────────────────┬─────────────────────────────────┤
│                           │  Brand Name                     │
│    Image Gallery          │  Product Name (Large)           │
│   ┌─────────────────┐    │  ★★★★☆ 4.5 (120 reviews)       │
│   │                 │    │                                  │
│   │  Primary Image  │    │  ₹3000  ₹2500  [16% OFF]       │
│   │                 │    │                                  │
│   └─────────────────┘    │  Select Variant:                │
│   [thumb][thumb][thumb]  │  [ 2L ] [ 3L ] [ 5L ]          │
│                           │                                  │
│                           │  Description text...            │
│                           │                                  │
│                           │  🛒 Add to Wishlist             │
│                           │                                  │
├───────────────────────────┴─────────────────────────────────┤
│  Accordion Sections:                                         │
│  ▼ Product Details (expanded)                               │
│    - Specifications table                                    │
│  ▶ Delivery Information                                     │
│  ▶ Return Policy                                            │
├──────────────────────────────────────────────────────────────┤
│  Related Products (Horizontal scroll)                        │
│  [tile] [tile] [tile] [tile] [tile]                        │
└──────────────────────────────────────────────────────────────┘
```

**Left Column (50% width)**:
- Primary image: Large (500x500px or larger), center
- Thumbnails: Row below, 4-5 visible, horizontal scroll if more
- Thumbnail size: 80x80px, border on selected, click to change main image

**Right Column (50% width)**:
- All product info, sticky on scroll (stays visible while scrolling)
- Padding: 24px

**Specifications**:
- Container max-width: 1280px
- Gap between columns: 48px
- Breadcrumb: Font-small, Gray 500, margin-bottom 24px

### Mobile Layout (< 640px)

**Single Column Stack**:
1. Breadcrumb (collapsible if long)
2. Image gallery (full width, swipe between images)
3. Product info (all stacked)
4. Variant selector (horizontal scroll if many variants)
5. Wishlist button (full width, sticky at bottom OR inline)
6. Accordion sections
7. Related products (horizontal carousel)

---

## 5. Buttons

### Primary Button (CTAs)
```css
Background: Primary Teal (#0F766E)
Text: White, Medium weight
Padding: 12px 24px (default), 10px 20px (small), 14px 28px (large)
Border-radius: Default (6px)
Hover: Background → Primary Hover (#0D6660), slight shadow
Active: Scale 0.98
Disabled: Background Gray 300, cursor not-allowed
```

**Usage**: Main actions (Add to Wishlist, Login, Save, Publish)

### Secondary Button
```css
Background: White or transparent
Border: 1px solid Primary Teal
Text: Primary Teal, Medium weight
Padding: Same as primary
Hover: Background Primary Light (#CCFBF1)
```

**Usage**: Cancel, Secondary actions, View Details

### Danger Button (Delete/Remove)
```css
Background: Error Red (#EF4444)
Text: White
Padding: Same as primary
Hover: Background darker red
```

**Usage**: Delete, Remove from wishlist, Logout

### Icon Button
```css
Size: 40x40px (touch-friendly)
Background: Transparent or Gray 100
Icon: 20x20px
Border-radius: Full (circle) or Default
Hover: Background Gray 200
```

**Usage**: Close modal, Expand/collapse, Icon-only actions

---

## 6. Forms & Inputs

### Text Input
```css
Height: 44px (touch-friendly)
Padding: 12px 16px
Border: 1px solid Gray 200
Border-radius: Default (6px)
Background: White
Font: Base size, Gray 700

Focus:
  Border: Primary Teal
  Outline: 2px Primary Light (offset 2px)
  
Error:
  Border: Error Red
  Helper text: Error Red, font-small below input

Disabled:
  Background: Gray 100
  Cursor: not-allowed
```

### Textarea
- Same as text input
- Min-height: 120px
- Resize: Vertical only

### Select Dropdown
- Same styling as text input
- Chevron-down icon on right
- Options: Dropdown menu with hover states

### Checkbox & Radio
- Size: 20x20px
- Border: 2px solid Gray 300
- Checked: Background Primary Teal, white checkmark
- Border-radius: Small (checkbox), Full (radio)

### Label
```css
Font: Small, Medium weight, Gray 700
Margin-bottom: 6px
Required indicator: Red asterisk (*)
```

---

## 7. Cards

### Product Card (Used in grids)
- See "Product Tile" section above

### Category Card (Homepage)
```
┌────────────────┐
│                │
│  Cat. Image    │ ← Square or slightly portrait
│                │
├────────────────┤
│ Category Name  │ ← Centered, semibold
│ 25 products    │ ← Small, gray (optional)
└────────────────┘
```

**Specifications**:
- Border-radius: Medium
- Hover: Scale 1.03, shadow-medium
- Image aspect ratio: 1:1 or 4:5
- Text padding: 16px

### Info Card (Dashboard stats)
```
┌─────────────────────┐
│ 🔢 Icon             │
│ 1,234               │ ← Large number, semibold
│ Total Products      │ ← Label, small, gray
└─────────────────────┘
```

**Specifications**:
- Background: Gradient or solid color (Primary Light, Success Light, etc.)
- Border-radius: Large
- Padding: 24px
- Icon: 32x32px, color matching theme

---

## 8. Modals & Overlays

### Modal Dialog

**Research-Based Best Practice**: Center modal for important actions (login, delete confirmation)

**Specifications**:
```
Backdrop: rgba(0,0,0,0.5) - dark overlay
Modal Container:
  Background: White
  Border-radius: Large (12px)
  Shadow: XL
  Max-width: 500px (small modals), 800px (large)
  Padding: 24px
  Position: Center of viewport
  
Animation: Fade in + scale from 0.95 to 1
```

**Header**:
- Title: h3 size, Semibold
- Close button (X): Top-right, Icon button

**Body**:
- Content area with scrolling if needed
- Max-height: 80vh

**Footer**:
- Action buttons (right-aligned)
- Cancel (secondary) + Primary action
- Spacing: 12px between buttons

### Drawer (Side Panel)

**For**: Mobile menu, filters (Phase 2)

**Specifications**:
```
Width: 80% of screen (mobile), 320px fixed (desktop)
Height: 100vh
Position: Slide from left/right
Background: White
Shadow: XL on visible side
Animation: Slide in transform
```

---

## 9. Loading States

### Spinner (Phase 1)

**Specifications**:
```
Size: 
  Small: 16x16px (inline loading)
  Default: 32x32px (button loading)
  Large: 48x48px (page loading)

Color: Primary Teal
Animation: Rotate 360deg, 1s linear infinite

Usage:
  - Center of page for full-page loading
  - Inside button (replace text) for button loading
  - Inline for component loading
```

**Spinner Component**:
```html
<div class="spinner">
  <svg class="animate-spin h-8 w-8 text-teal-700">
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
    <path fill="currentColor" d="..." opacity="0.75"/>
  </svg>
</div>
```

### Skeleton Loader (Phase 2)
- Placeholder for content while loading
- Animated shimmer effect
- Gray 200 background with Gray 300 shimmer

---

## 10. Badges & Tags

### Discount Badge
```css
Background: Accent Light (#FEF3C7)
Text: Accent Amber (#D97706), Semibold
Font: Small (14px)
Padding: 4px 8px
Border-radius: Small
```

### Status Badge (Admin)
```css
Active: Green background, darker green text
Draft: Yellow background, darker yellow text
Archived: Red background, darker red text

Padding: 4px 12px
Border-radius: Full (pill)
Font: Tiny (12px), Medium weight
```

### Product Badge (Featured, New, etc.)
```css
Position: Top-left of product image (absolute)
Background: Primary Teal or Success Green
Text: White, Tiny font, Bold
Padding: 4px 8px
Border-radius: Small (bottom-right only)
```

---

## 11. Toast Notifications

**Research-Based**: Bottom-center (mobile) or top-right (desktop) placement

**Specifications**:
```
Position: Fixed
  Desktop: Top-right, 16px from top and right
  Mobile: Bottom-center, 16px from bottom

Width: 
  Desktop: 360px
  Mobile: 90% (max 360px)

Background: 
  Success: Success Green
  Error: Error Red
  Info: Primary Teal
  Warning: Warning Yellow

Text: White (except warning: Gray 900)
Padding: 16px
Border-radius: Default
Shadow: Large

Animation: Slide in + fade, auto-dismiss after 5s

Components:
  - Icon (left): Matching semantic color
  - Message text (center)
  - Close button (right, optional)
```

---

## 12. Breadcrumbs

**Specifications**:
```html
Home > Electronics > Mixer Grinder > Product Name
```

```css
Font: Small (14px)
Color: Gray 500
Links: Hover → Primary Teal, underline
Separator: "/" or ">" in Gray 400
Current page: Gray 900, not clickable

Truncate on mobile: Show only last 2 levels with "..."
Example mobile: ... > Mixer Grinder > Product Name
```

---

# PAGE-SPECIFIC LAYOUTS

## Homepage

### Desktop Layout
```
┌─────────────────────────────────────┐
│ Header (sticky)                     │
├─────────────────────────────────────┤
│ Hero Banner Carousel (full-width)   │ ← Height: 400px
│ [Banner slides]                      │
├─────────────────────────────────────┤
│ Categories Section                   │
│ ┌────┬────┬────┬────┬────┬────┐   │
│ │Cat1│Cat2│Cat3│Cat4│Cat5│Cat6│   │ ← Grid: 6 cols desktop
│ └────┴────┴────┴────┴────┴────┘   │
├─────────────────────────────────────┤
│ Featured Products (optional Ph 2)   │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### Mobile Layout
```
┌────────────┐
│ Header     │
├────────────┤
│ Banner     │ ← Height: 200px, swipeable
│ Carousel   │
├────────────┤
│ Categories │
│ ┌───┬───┐ │ ← Grid: 2 cols mobile
│ │C1 │C2 │ │
│ ├───┼───┤ │
│ │C3 │C4 │ │
│ └───┴───┘ │
├────────────┤
│ Footer     │
└────────────┘
```

**Banner Specifications**:
- Auto-rotate: 5 seconds
- Manual controls: Prev/Next arrows (desktop), swipe (mobile)
- Dot indicators: Bottom-center
- Image: Cover entire area, object-fit cover

**Category Grid**:
- Desktop: 4-6 columns (adjust based on count)
- Tablet: 3-4 columns
- Mobile: 2 columns
- Gap: 16px (mobile), 24px (desktop)

---

## Category / Product Listing Page

### Desktop Layout
```
┌──────────────────────────────────────────┐
│ Breadcrumb                               │
├──────────────────────────────────────────┤
│ Category Name (h1)                       │
│ Description (if available)               │
├──────────────────────────────────────────┤
│ Subcategories (if has children)          │
│ ┌─────┬─────┬─────┬─────┐              │
│ │Sub1 │Sub2 │Sub3 │Sub4 │              │
│ └─────┴─────┴─────┴─────┘              │
│                                          │
│ OR                                       │
│                                          │
│ Products Grid                            │
│ ┌────┬────┬────┬────┐                  │
│ │Prd1│Prd2│Prd3│Prd4│                  │
│ ├────┼────┼────┼────┤                  │
│ │Prd5│Prd6│Prd7│Prd8│                  │
│ └────┴────┴────┴────┘                  │
│                                          │
│ [Load More] or Pagination               │
└──────────────────────────────────────────┘
```

**Product Grid Responsive**:
- Desktop (1024px+): 4 columns
- Tablet (768px): 3 columns
- Mobile (< 640px): 2 columns
- Gap: 16px mobile, 24px desktop

**Pagination** (if used):
- Center-aligned
- Previous/Next buttons + page numbers
- Style: Primary Teal for active page

---

## Wishlist Page

### Layout (Similar to Product Grid)
```
┌─────────────────────────────────┐
│ My Wishlist (5 items)           │
│ [Clear All]                     │
├─────────────────────────────────┤
│ ┌────┬────┬────┬────┐          │
│ │Prd │Prd │Prd │Prd │          │
│ │ ×  │ ×  │ ×  │ ×  │  ← Remove button
│ └────┴────┴────┴────┘          │
└─────────────────────────────────┘
```

**Remove Button**:
- Icon: X or trash
- Position: Top-right of product tile (absolute)
- Style: Danger red on hover
- Click: Show confirmation or remove immediately

**Empty State**:
```
┌─────────────────────────────────┐
│       🛒                         │
│  Your wishlist is empty         │
│  [Browse Products]              │
└─────────────────────────────────┘
```

---

## Admin Panel Layout

### Sidebar Navigation (Desktop)

```
┌──────────┬────────────────────────────────┐
│ LOGO     │ Admin Dashboard                │
│          │                                 │
│ Dashbrd  │ ┌────┬────┬────┬────┐         │
│ Products │ │Stat│Stat│Stat│Stat│         │
│ Category │ └────┴────┴────┴────┘         │
│ Banners  │                                │
│ Analytics│ Recent Activity...             │
│          │                                │
│ [Logout] │                                │
└──────────┴────────────────────────────────┘
```

**Sidebar Specifications**:
- Width: 240px fixed
- Background: White or Gray 50
- Border-right: 1px Gray 200
- Height: 100vh, sticky

**Menu Items**:
- Padding: 12px 20px
- Font: Base, Medium
- Active: Background Primary Light, text Primary Teal, left border 3px Primary Teal
- Hover: Background Gray 100
- Icon + Text layout

**Main Content Area**:
- Padding: 24px
- Max-width: 1280px
- Background: Gray 50 (subtle difference from white cards)

### Mobile Admin (< 768px)
- Hamburger menu to toggle sidebar
- Sidebar becomes drawer (overlay)
- Top bar with hamburger + "Admin Panel" title
- Content: Full width below top bar

---

## Admin: Product List (Table Layout)

**Desktop Table**:
```
┌──────────────────────────────────────────────────────────┐
│ Products                                   [+ Add Product]│
│ Search: [............]  Filter: [Category▼] [Brand▼]     │
├──┬────────┬──────┬──────────┬──────┬────────┬──────┬────┤
│☑│ Image  │ Name │  Brand   │ Cat. │ Price  │Status│ Act│
├──┼────────┼──────┼──────────┼──────┼────────┼──────┼────┤
│☑│ [img]  │ Pres.│ Prestige │ Cook.│ ₹2500  │Active│ ✏🗑│
│☑│ [img]  │ Bajaj│ Bajaj    │ Mix. │ ₹3200  │Draft │ ✏🗑│
└──┴────────┴──────┴──────────┴──────┴────────┴──────┴────┘
```

**Table Specifications**:
- Background: White
- Border: 1px Gray 200, border-radius medium
- Header: Background Gray 50, font-medium, Gray 700
- Rows: Border-bottom Gray 200, hover background Gray 50
- Image column: 60x60px thumbnail
- Actions: Icon buttons (Edit, Delete) with hover tooltips
- Checkbox: For bulk selection (Phase 2)

**Mobile Table**:
- Convert to card layout (stacked)
- Each product as a card with all info

---

## Admin: Product Form

**Form Layout**:
```
┌─────────────────────────────────────────┐
│ Add New Product                [Cancel] │
├─────────────────────────────────────────┤
│ Basic Information                        │
│ ┌─────────────────────────────────────┐ │
│ │ Product Name*                       │ │
│ │ [...........................]       │ │
│ │                                     │ │
│ │ Brand*        Category*             │ │
│ │ [Select▼]     [Select▼]            │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ Product Images                           │
│ ┌─────────────────────────────────────┐ │
│ │  Drag & drop or click to upload     │ │
│ │  [Upload zone]                      │ │
│ │                                     │ │
│ │  Uploaded: [img] [img] [img]       │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ Product Variants                         │
│ ┌─────────────────────────────────────┐ │
│ │ Variant 1: 2 Litre                  │ │
│ │ SKU: [...] MRP: [...] Price: [...]  │ │
│ │ [Remove]                            │ │
│ └─────────────────────────────────────┘ │
│ [+ Add Variant]                          │
│                                          │
│           [Save Draft] [Publish]         │
└─────────────────────────────────────────┘
```

**Form Styling**:
- Sections: Separated by margin-bottom 32px
- Section headers: h3 size, margin-bottom 16px
- Field groups: Margin-bottom 16px
- Two-column layout where applicable (desktop)
- Stack to single column on mobile

---

# RESPONSIVE BEHAVIOR SUMMARY

## Mobile-First Approach (User Pages)

**Strategy**:
1. Design for mobile first (320px-640px)
2. Enhance for tablet (640px-1024px)
3. Optimize for desktop (1024px+)

**Key Responsive Changes**:

### < 640px (Mobile)
- Header: Hamburger menu, stacked icons
- Product grid: 2 columns
- Category grid: 2 columns
- Product detail: Single column stack
- Footer: Single column, center-aligned
- Font sizes: Slightly smaller
- Buttons: Full width where appropriate
- Modals: Full screen or 95% width

### 640px - 1024px (Tablet)
- Product grid: 3 columns
- Category grid: 3-4 columns
- Product detail: Still single column or early two-column
- Header: Partial desktop layout

### 1024px+ (Desktop)
- Product grid: 4 columns
- Category grid: 4-6 columns
- Product detail: Two-column layout
- Header: Full desktop layout with all elements
- Sidebar navigation visible (admin)

---

# ACCESSIBILITY CONSIDERATIONS

## WCAG 2.1 AA Compliance (Phase 1 Basics)

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- All chosen colors meet these requirements

### Keyboard Navigation
- All interactive elements: Focusable with Tab
- Focus indicators: Visible outline (2px Primary Teal)
- Modal: Trap focus inside, Escape to close
- Dropdown menus: Arrow keys to navigate

### Screen Reader Support
- Images: Alt text required (descriptive for products)
- Buttons: Aria-label if icon-only
- Form inputs: Associated labels
- Skip to main content link

### Touch Targets
- Minimum size: 44x44px (iOS/Android guidelines)
- Spacing between targets: 8px minimum

### Forms
- Error messages: Linked to inputs (aria-describedby)
- Required fields: Marked visually (*) and with aria-required
- Validation: Real-time feedback

---

# ANIMATIONS & TRANSITIONS

## Recommended Durations
```
Fast:    150ms  - Hover states, focus
Default: 250ms  - Most transitions
Slow:     350ms  - Page transitions, modals
```

## Easing Functions
```
Ease-out: Most UI transitions (elements appearing)
Ease-in: Elements disappearing
Ease-in-out: Smooth both ways (modals, drawers)
```

## Common Transitions
```css
/* Hover effects */
transition: all 0.25s ease-out;

/* Button hover */
transition: background-color 0.15s ease-out, 
            transform 0.15s ease-out;

/* Modal appearance */
transition: opacity 0.25s ease-out, 
            transform 0.25s ease-out;

/* Page transitions */
transition: opacity 0.35s ease-in-out;
```

## Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# RECOMMENDED UI COMPONENT LIBRARY

## Primary Recommendation: **shadcn/ui + Tailwind CSS**

**Rationale**:
- ✅ Highly customizable (copy components, modify as needed)
- ✅ Tailwind-based (consistent with color/spacing system)
- ✅ Modern, clean design (perfect for e-commerce)
- ✅ Excellent accessibility out-of-box
- ✅ TypeScript support
- ✅ Not a dependency (owns the code)
- ✅ Great for both user pages and admin

**Alternative for Admin**: **Ant Design**
- If admin needs heavy data tables, complex forms
- Pro: Comprehensive components (Table, Form, Upload excellent)
- Con: Larger bundle size, less customizable

**Implementation Plan**:
- User-facing pages: shadcn/ui components
- Admin: shadcn/ui (or Ant Design if complex tables needed)
- Icons: lucide-react (comes with shadcn/ui) or react-icons
- Carousel: embla-carousel-react or swiper

---

# DESIGN SYSTEM IMPLEMENTATION CHECKLIST

**For Agent Implementing UI**:

- [ ] Setup Tailwind CSS with custom theme config
- [ ] Define color variables in tailwind.config.js
- [ ] Install shadcn/ui and add base components
- [ ] Create reusable components:
  - [ ] Button (Primary, Secondary, Danger variants)
  - [ ] Input (Text, Select, Textarea, Checkbox)
  - [ ] Card
  - [ ] Badge
  - [ ] Modal
  - [ ] Toast notification system
  - [ ] Spinner/Loading
- [ ] Setup responsive container component
- [ ] Create layout components (Header, Footer, AdminSidebar)
- [ ] Implement focus styles for keyboard navigation
- [ ] Test on mobile, tablet, desktop viewports
- [ ] Verify color contrast ratios
- [ ] Add skip-to-content link for accessibility

---

**End of UI Specifications** - Use this document for all visual design and component implementation decisions.
