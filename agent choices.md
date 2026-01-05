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
*(To be documented as components are built)*

---

## 3. FILE STRUCTURE CONVENTIONS

```
store/src/
├── app/              # Pages (App Router)
├── components/       
│   ├── ui/          # shadcn/ui components (auto-generated)
│   ├── layout/      # Header, Footer, Nav (Step 3)
│   ├── product/     # ProductCard, ProductGrid, etc.
│   └── common/      # Breadcrumb, Rating, etc.
├── context/         # React Context (Auth, etc.)
├── hooks/           # Custom hooks
├── lib/             # Utilities (api.ts, utils.ts)
├── mock_data/       # JSON mock data
└── types/           # TypeScript interfaces
```

---

## 4. API CONVENTIONS (To be updated)

*(Documented as API routes are implemented)*

---

## 5. IMPORTANT REMINDERS

- **Single source of truth**: All colors are in `globals.css` CSS variables
- **Mobile-first**: User pages designed for mobile, scaled up for desktop
- **Admin desktop-first**: Admin panel optimized for desktop editing
- **Performance**: Always consider loading time impact of decisions
- **Consistency**: Use design tokens, don't hardcode colors/sizes

---

*Last Updated: 2025-01-05 (Step 2: Design System)*
