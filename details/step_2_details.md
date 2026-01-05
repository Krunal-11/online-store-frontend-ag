# STEP 2: DESIGN SYSTEM AND THEME SETUP - DETAILED BREAKDOWN

**Date Completed**: January 5, 2026  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [What is a Design System?](#what-is-a-design-system)
3. [Tailwind CSS v4 Configuration](#tailwind-css-v4-configuration)
4. [CSS Custom Properties (Variables)](#css-custom-properties-variables)
5. [Color System Deep Dive](#color-system-deep-dive)
6. [Typography System](#typography-system)
7. [shadcn/ui Theme Integration](#shadcnui-theme-integration)
8. [Custom Utility Classes](#custom-utility-classes)
9. [Complete Code Walkthrough](#complete-code-walkthrough)
10. [Key Concepts Explained](#key-concepts-explained)
11. [How to Customize](#how-to-customize)

---

## Overview

Step 2 established the visual foundation of the application - the design system. This ensures every component, page, and UI element looks consistent and follows the same visual rules.

**What was accomplished:**
- ✅ Brand color palette (Teal primary, Amber accent)
- ✅ CSS custom properties for theming
- ✅ Tailwind CSS v4 theme configuration
- ✅ shadcn/ui compatible color variables
- ✅ System font stack (zero load time)
- ✅ Custom utility classes for pricing
- ✅ Base styles (scrollbars, focus states, selection)
- ✅ Documentation in agent choices.md

**Files Modified:**
- `store/src/app/globals.css` - All design tokens
- `agent choices.md` - Design decisions documentation

---

## What is a Design System?

### Definition
A **design system** is a collection of reusable rules, values, and components that help maintain visual consistency across an application.

### Components of a Design System

```
Design System
├── Colors          → Primary, secondary, semantic colors
├── Typography      → Font families, sizes, weights
├── Spacing         → Margins, paddings, gaps
├── Border Radius   → Rounded corners
├── Shadows         → Elevation effects
├── Animation       → Transitions, durations
└── Components      → Buttons, cards, inputs (built on above)
```

### Why Do We Need One?

**Without Design System:**
```css
/* File 1 */
.button { background: #0F766E; }

/* File 2 */
.header { background: #0f766e; }  /* Same color, different case */

/* File 3 */
.card { background: rgb(15, 118, 110); }  /* Same color, different format */

/* File 4 */
.link { color: #0E6B63; }  /* Oops! Slightly different shade */
```
**Problem:** Colors are scattered, inconsistent, hard to change.

**With Design System:**
```css
:root {
  --primary: #0F766E;  /* Define once */
}

/* All files use the variable */
.button { background: var(--primary); }
.header { background: var(--primary); }
.card { background: var(--primary); }
.link { color: var(--primary); }
```
**Benefit:** Change `--primary` in one place → Updates everywhere!

---

## Tailwind CSS v4 Configuration

### What Changed in Tailwind v4?

**Tailwind v3 (Old Way):**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0F766E',
        accent: '#F59E0B',
      },
    },
  },
};
```
Configuration in a JavaScript file.

**Tailwind v4 (New Way - CSS-First):**
```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  --color-primary: #0F766E;
  --color-accent: #F59E0B;
}
```
Configuration directly in CSS! No separate config file needed.

### Why CSS-First is Better

| Aspect | Tailwind v3 | Tailwind v4 |
|--------|-------------|-------------|
| Config Location | `tailwind.config.js` | `globals.css` |
| Syntax | JavaScript | CSS |
| Learning Curve | Need to know JS config | Just CSS variables |
| IDE Support | Limited | Full CSS autocomplete |
| Runtime | Needs build step | Native CSS |

### The `@theme inline` Directive

```css
@theme inline {
  /* Everything here becomes available as Tailwind classes */
  --color-primary: hsl(var(--primary));
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}
```

**What `@theme inline` does:**
- Tells Tailwind "these are my custom theme values"
- Makes variables available as utility classes
- `--color-primary` → You can now use `bg-primary`, `text-primary`
- `--font-sans` → You can use `font-sans`

---

## CSS Custom Properties (Variables)

### What Are CSS Variables?

CSS Custom Properties (also called CSS Variables) let you store values and reuse them throughout your stylesheet.

### Syntax

```css
/* Define a variable */
:root {
  --my-color: blue;
}

/* Use the variable */
.button {
  background: var(--my-color);
}
```

### The `:root` Selector

`:root` is the highest-level element in the document (the `<html>` tag). Variables defined here are available **everywhere**.

```css
:root {
  --primary: #0F766E;  /* Available to ALL elements */
}

.container {
  --container-padding: 1rem;  /* Only available inside .container */
}
```

### Variable Naming Convention

We use a consistent naming pattern:

```css
:root {
  /* Format: --[component]-[property] or --[role] */
  
  /* Color roles */
  --primary: 167 65% 26%;
  --secondary: 0 0% 96%;
  --accent: 38 92% 50%;
  
  /* Semantic colors */
  --destructive: 0 84% 60%;
  --success: 142 71% 45%;
  
  /* Component-specific */
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  
  /* UI elements */
  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 167 65% 26%;
}
```

### Why HSL Format?

We store colors in HSL (Hue, Saturation, Lightness) format **without** the `hsl()` wrapper:

```css
/* How we store it */
--primary: 167 65% 26%;  /* Just the values */

/* How we use it */
background: hsl(var(--primary));  /* Wrap when using */
```

**Why this pattern?**

1. **Opacity Support:**
```css
/* Can add opacity easily */
background: hsl(var(--primary) / 0.5);  /* 50% transparent */
background: hsl(var(--primary) / 0.1);  /* 10% transparent */
```

2. **shadcn/ui Compatibility:**
shadcn/ui components expect this format. It allows them to adjust opacity dynamically.

### HSL Color Explained

HSL = **H**ue, **S**aturation, **L**ightness

```
H (Hue): 0-360 degrees on color wheel
  0   = Red
  120 = Green
  240 = Blue
  167 = Teal (our primary)

S (Saturation): 0-100%
  0%   = Gray (no color)
  100% = Full color
  65%  = Rich but not overwhelming

L (Lightness): 0-100%
  0%   = Black
  50%  = Pure color
  100% = White
  26%  = Dark shade (our primary)
```

**Our Primary Color Breakdown:**
```css
--primary: 167 65% 26%;
/*          │   │   └── Lightness: 26% (dark, but not too dark)
            │   └────── Saturation: 65% (rich, vibrant)
            └────────── Hue: 167° (teal/cyan on color wheel) */
```

---

## Color System Deep Dive

### Brand Colors

#### Primary: Deep Teal (#0F766E)

```css
--primary: 167 65% 26%;
```

**Where it's used:**
- Navigation bar background
- Primary buttons
- Links
- Active states
- Focus rings

**Why Teal?**
- **Professional** - Commonly used in retail and home goods
- **Trustworthy** - Similar to bank/finance apps
- **Distinctive** - Not as common as blue, stands out
- **Accessible** - Good contrast with white text

#### Accent: Warm Amber (#F59E0B)

```css
--accent: 38 92% 50%;
```

**Where it's used:**
- Call-to-action buttons
- Discount badges ("20% OFF")
- Sale indicators
- Highlight important info

**Why Amber?**
- **Attention-grabbing** - Naturally draws the eye
- **Warm** - Inviting, not aggressive
- **Complements Teal** - Opposite on color wheel
- **E-commerce standard** - Users associate it with deals

### Semantic Colors

These colors have meaning attached to them:

```css
/* Success - Things went well */
--success: 142 71% 45%;  /* Green #22C55E */
/* Used for: "Added to wishlist", discount percentages, in-stock */

/* Destructive - Danger, delete, errors */
--destructive: 0 84% 60%;  /* Red #EF4444 */
/* Used for: Error messages, delete buttons, out-of-stock */

/* Warning - Caution needed */
--warning: 38 92% 50%;  /* Amber #F59E0B */
/* Used for: Warnings, limited stock */
```

### Neutral Colors (Grays)

```css
/* Background colors */
--background: 0 0% 100%;     /* White - page background */
--card: 0 0% 100%;           /* White - card background */
--muted: 0 0% 96%;           /* Light gray - secondary backgrounds */

/* Text colors */
--foreground: 0 0% 9%;       /* Near black - primary text */
--muted-foreground: 0 0% 45%; /* Medium gray - secondary text */

/* Border and input */
--border: 0 0% 90%;          /* Light gray - borders */
--input: 0 0% 90%;           /* Light gray - input borders */
```

### Color Scales (50-900)

For more nuanced usage, we have full color scales:

```css
/* Teal Scale - Primary */
--color-brand-teal-50: #f0fdfa;   /* Lightest - hover backgrounds */
--color-brand-teal-100: #ccfbf1;
--color-brand-teal-200: #99f6e4;
--color-brand-teal-300: #5eead4;
--color-brand-teal-400: #2dd4bf;
--color-brand-teal-500: #14b8a6;  /* Mid-tone */
--color-brand-teal-600: #0d9488;
--color-brand-teal-700: #0f766e;  /* Our primary color */
--color-brand-teal-800: #115e59;
--color-brand-teal-900: #134e4a;  /* Darkest - active states */

/* Amber Scale - Accent */
--color-brand-amber-50: #fffbeb;
--color-brand-amber-100: #fef3c7;
--color-brand-amber-200: #fde68a;
--color-brand-amber-300: #fcd34d;
--color-brand-amber-400: #fbbf24;
--color-brand-amber-500: #f59e0b;  /* Our accent color */
--color-brand-amber-600: #d97706;
--color-brand-amber-700: #b45309;
--color-brand-amber-800: #92400e;
--color-brand-amber-900: #78350f;
```

**Usage Examples:**
```html
<!-- Hover effect: lighter shade -->
<button class="bg-brand-teal-700 hover:bg-brand-teal-600">
  Shop Now
</button>

<!-- Subtle background -->
<div class="bg-brand-amber-50 border border-brand-amber-200">
  🎉 Special Offer!
</div>
```

---

## Typography System

### System Font Stack

We use **system fonts** instead of loading custom fonts like Google Fonts.

```css
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", 
             sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
```

### How Font Stack Works

The browser tries each font in order:

```
1. ui-sans-serif      → Modern browsers' default UI font
2. system-ui          → Operating system's UI font
3. -apple-system      → Apple devices (San Francisco font)
4. BlinkMacSystemFont → Older Chrome on Mac
5. "Segoe UI"         → Windows
6. Roboto             → Android
7. "Helvetica Neue"   → Older macOS
8. Arial              → Universal fallback
9. "Noto Sans"        → Linux
10. sans-serif        → Final fallback
11. Emoji fonts       → For emoji support
```

### Why System Fonts?

| Aspect | Custom Fonts (Google Fonts) | System Fonts |
|--------|----------------------------|--------------|
| Load Time | ~100-300ms extra | 0ms (already on device) |
| Network Request | 1-3 requests | 0 requests |
| File Size | 20-100KB | 0KB |
| Look | Exact same everywhere | Varies by OS |
| Fallback | Needs careful handling | Always works |
| Privacy | Google tracking possible | No tracking |

**For an e-commerce site, speed > pixel-perfect fonts.**

### What Users See

| Operating System | Font Displayed |
|-----------------|----------------|
| Windows 10/11 | Segoe UI |
| macOS | San Francisco |
| iOS | San Francisco |
| Android | Roboto |
| Linux | Ubuntu/Noto Sans |

### Font Sizes (Tailwind Default Scale)

```css
/* Available utility classes */
text-xs    → 0.75rem  (12px)  /* Badges, captions */
text-sm    → 0.875rem (14px)  /* Secondary text, labels */
text-base  → 1rem     (16px)  /* Body text */
text-lg    → 1.125rem (18px)  /* Subheadings */
text-xl    → 1.25rem  (20px)  /* Product names */
text-2xl   → 1.5rem   (24px)  /* Section titles */
text-3xl   → 1.875rem (30px)  /* Page titles */
text-4xl   → 2.25rem  (36px)  /* Hero text */
```

**Usage:**
```html
<h1 class="text-3xl font-bold">Page Title</h1>
<p class="text-base">Regular body text here.</p>
<span class="text-sm text-muted-foreground">Secondary info</span>
```

---

## shadcn/ui Theme Integration

### How shadcn/ui Uses CSS Variables

shadcn/ui components are built to read colors from CSS variables. This is why our variable names follow a specific pattern.

### Required Variables for shadcn/ui

```css
:root {
  /* Core colors - shadcn/ui REQUIRES these names */
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 9%;
  
  --primary: 167 65% 26%;           /* Your brand color */
  --primary-foreground: 0 0% 100%;  /* Text on primary */
  
  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 9%;
  
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;
  
  --accent: 38 92% 50%;             /* Your accent color */
  --accent-foreground: 0 0% 9%;
  
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  
  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 167 65% 26%;
  
  --radius: 0.5rem;
}
```

### The `-foreground` Pattern

For every background color, there's a matching foreground (text) color:

```css
--primary: 167 65% 26%;           /* Dark teal background */
--primary-foreground: 0 0% 100%;  /* White text on it */

--accent: 38 92% 50%;             /* Amber background */
--accent-foreground: 0 0% 9%;     /* Dark text on it */
```

**Why?**
- Ensures readable text contrast
- Accessibility compliance
- shadcn/ui buttons use both:

```jsx
// Button with primary variant
<Button variant="primary">
  {/* Rendered CSS: */}
  {/* background: hsl(var(--primary)); */}
  {/* color: hsl(var(--primary-foreground)); */}
</Button>
```

### How Components Use Variables

**Example: shadcn/ui Button component**

```typescript
// components/ui/button.tsx (simplified)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
  }
);
```

**Notice:**
- Classes like `bg-primary` come from our CSS variables
- Tailwind reads `--color-primary` from `@theme inline`
- No hardcoded colors in components!

---

## Custom Utility Classes

### Price Display Classes

We created custom classes for consistent price display:

```css
/* Large, bold selling price */
.price-selling {
  font-size: 1.25rem;    /* 20px */
  font-weight: 700;      /* Bold */
  color: hsl(var(--foreground));
}

/* Strikethrough original price (MRP) */
.price-mrp {
  font-size: 0.875rem;   /* 14px */
  color: hsl(var(--muted-foreground));  /* Gray */
  text-decoration: line-through;
}

/* Discount percentage in green */
.price-discount {
  font-size: 0.75rem;    /* 12px */
  font-weight: 600;      /* Semi-bold */
  color: hsl(var(--success));  /* Green */
}
```

**Usage:**
```html
<div class="flex items-center gap-2">
  <span class="price-selling">₹2,500</span>
  <span class="price-mrp">₹3,000</span>
  <span class="price-discount">16% OFF</span>
</div>
```

**Result:**
- ₹2,500 (large, bold, black)
- ~~₹3,000~~ (small, gray, strikethrough)
- 16% OFF (small, green)

### Container Utility

```css
/* Centered container with responsive padding */
.container-main {
  width: 100%;
  max-width: 1280px;    /* Max container width */
  margin: 0 auto;       /* Center horizontally */
  padding-left: 1rem;   /* Mobile: 16px padding */
  padding-right: 1rem;
}

@media (min-width: 640px) {  /* Tablet */
  .container-main {
    padding-left: 1.5rem;    /* 24px padding */
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {  /* Desktop */
  .container-main {
    padding-left: 2rem;       /* 32px padding */
    padding-right: 2rem;
  }
}
```

**Usage:**
```html
<main class="container-main">
  <!-- Content is centered with proper padding -->
</main>
```

---

## Complete Code Walkthrough

### Full `globals.css` Explained

```css
/* ========================================
   SECTION 1: TAILWIND IMPORT
   ======================================== */
@import "tailwindcss";

/* This imports all of Tailwind CSS functionality */


/* ========================================
   SECTION 2: CSS CUSTOM PROPERTIES
   ======================================== */

:root {
  /* ----- BRAND COLORS ----- */
  
  /* Primary Color: Deep Teal
     Used for: Headers, navigation, primary buttons, links
     HSL: 167° hue (teal), 65% saturation, 26% lightness */
  --primary: 167 65% 26%;
  --primary-foreground: 0 0% 100%;  /* White text on teal */
  
  /* Accent Color: Warm Amber
     Used for: CTAs, discounts, highlights, sale badges
     HSL: 38° hue (orange-yellow), 92% saturation, 50% lightness */
  --accent: 38 92% 50%;
  --accent-foreground: 0 0% 9%;  /* Dark text on amber */
  
  /* ----- SEMANTIC COLORS ----- */
  
  /* Destructive: For errors, delete actions */
  --destructive: 0 84% 60%;  /* Red */
  --destructive-foreground: 0 0% 100%;
  
  /* Success: For positive feedback, discounts */
  --success: 142 71% 45%;  /* Green */
  --success-foreground: 0 0% 100%;
  
  /* Warning: For caution states */
  --warning: 38 92% 50%;  /* Same as accent */
  --warning-foreground: 0 0% 9%;
  
  /* ----- NEUTRAL COLORS ----- */
  
  /* Backgrounds */
  --background: 0 0% 100%;  /* White */
  --foreground: 0 0% 9%;    /* Near black text */
  
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 9%;
  
  --secondary: 0 0% 96%;  /* Light gray */
  --secondary-foreground: 0 0% 9%;
  
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;  /* Medium gray for secondary text */
  
  /* UI Elements */
  --border: 0 0% 90%;  /* Border color */
  --input: 0 0% 90%;   /* Input border color */
  --ring: 167 65% 26%; /* Focus ring (same as primary) */
  
  /* ----- COMPONENT SIZES ----- */
  --radius: 0.5rem;  /* 8px - base border radius */
}


/* ========================================
   SECTION 3: TAILWIND THEME CONFIGURATION
   ======================================== */

@theme inline {
  /* Map CSS variables to Tailwind color utilities */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  /* ... more mappings ... */
  
  /* Custom brand color scales */
  --color-brand-teal-50: #f0fdfa;
  --color-brand-teal-100: #ccfbf1;
  /* ... full scale ... */
  --color-brand-teal-700: #0f766e;  /* Primary */
  --color-brand-teal-900: #134e4a;
  
  --color-brand-amber-50: #fffbeb;
  /* ... full scale ... */
  --color-brand-amber-500: #f59e0b;  /* Accent */
  --color-brand-amber-900: #78350f;
  
  /* Typography */
  --font-sans: ui-sans-serif, system-ui, /* ... */;
  --font-mono: ui-monospace, /* ... */;
  
  /* Border radius scale */
  --radius-sm: calc(var(--radius) - 4px);  /* 4px */
  --radius-md: calc(var(--radius) - 2px);  /* 6px */
  --radius-lg: var(--radius);               /* 8px */
  --radius-xl: calc(var(--radius) + 4px);  /* 12px */
}


/* ========================================
   SECTION 4: BASE STYLES
   ======================================== */

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;     /* Smoother fonts on Mac */
  -moz-osx-font-smoothing: grayscale;      /* Smoother fonts on Firefox */
}


/* ========================================
   SECTION 5: CUSTOM UTILITIES
   ======================================== */

/* Price display styles */
.price-selling { /* ... */ }
.price-mrp { /* ... */ }
.price-discount { /* ... */ }

/* Container */
.container-main { /* ... */ }


/* ========================================
   SECTION 6: SCROLLBAR STYLING
   ======================================== */

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground));
}


/* ========================================
   SECTION 7: INTERACTION STATES
   ======================================== */

/* Focus outline for accessibility */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Text selection color */
::selection {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* Smooth transitions on interactive elements */
a, button, input, textarea, select {
  transition: all 0.15s ease-in-out;
}

/* Responsive images */
img {
  max-width: 100%;
  height: auto;
}
```

---

## Key Concepts Explained

### 1. Single Source of Truth

**Concept:** Define a value once, reference it everywhere.

**Problem without it:**
```css
.button { background: #0F766E; }
.link { color: #0F766E; }
.header { border-color: #0F766E; }
/* Need to rebrand? Change 100+ places! */
```

**Solution with variables:**
```css
:root { --primary: 167 65% 26%; }

.button { background: hsl(var(--primary)); }
.link { color: hsl(var(--primary)); }
.header { border-color: hsl(var(--primary)); }
/* Rebrand? Change ONE line! */
```

### 2. Design Tokens

Design tokens are the "atoms" of a design system - the smallest design decisions.

```css
/* Color tokens */
--primary: 167 65% 26%;

/* Spacing tokens */
--spacing-1: 0.25rem;
--spacing-2: 0.5rem;

/* Typography tokens */
--font-size-sm: 0.875rem;

/* Animation tokens */
--duration-fast: 0.15s;
```

Tailwind provides many of these by default. We extended it with our brand colors.

### 3. Foreground/Background Pairs

Every background color should have a matching text color for accessibility:

```css
/* Dark background → Light text */
--primary: 167 65% 26%;           /* Dark teal */
--primary-foreground: 0 0% 100%;  /* White */

/* Light background → Dark text */
--accent: 38 92% 50%;             /* Bright amber */
--accent-foreground: 0 0% 9%;     /* Near black */
```

**WCAG Accessibility:** Text must have at least 4.5:1 contrast ratio with background.

### 4. CSS `var()` Function

The `var()` function retrieves CSS variable values:

```css
/* Basic usage */
color: var(--primary);

/* With fallback (if variable doesn't exist) */
color: var(--primary, blue);

/* Nested in hsl() */
background: hsl(var(--primary));

/* With opacity */
background: hsl(var(--primary) / 0.5);
```

### 5. CSS `calc()` Function

Used for mathematical calculations in CSS:

```css
--radius: 0.5rem;  /* 8px */

--radius-sm: calc(var(--radius) - 4px);  /* 4px */
--radius-md: calc(var(--radius) - 2px);  /* 6px */
--radius-lg: var(--radius);               /* 8px */
--radius-xl: calc(var(--radius) + 4px);  /* 12px */
```

**This allows:** Change `--radius` and all derived values update automatically.

### 6. Media Queries for Responsive Design

```css
/* Mobile first (default) */
.container-main {
  padding: 1rem;  /* 16px on mobile */
}

/* Tablet and up */
@media (min-width: 640px) {
  .container-main {
    padding: 1.5rem;  /* 24px */
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container-main {
    padding: 2rem;  /* 32px */
  }
}
```

**Mobile-first approach:** Start with mobile styles, add complexity for larger screens.

---

## How to Customize

### Changing the Primary Color

**Step 1:** Find a color you like (e.g., from [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors))

**Step 2:** Convert to HSL (use [this tool](https://htmlcolors.com/rgb-to-hsl))

**Step 3:** Update `globals.css`:
```css
:root {
  /* Before: Teal */
  /* --primary: 167 65% 26%; */
  
  /* After: Indigo */
  --primary: 239 84% 67%;
}
```

**Step 4:** Update the color scale in `@theme inline` if needed.

### Adding a New Color

**Step 1:** Define the variable:
```css
:root {
  --info: 199 89% 48%;  /* Blue for informational messages */
  --info-foreground: 0 0% 100%;
}
```

**Step 2:** Add to Tailwind theme:
```css
@theme inline {
  --color-info: hsl(var(--info));
  --color-info-foreground: hsl(var(--info-foreground));
}
```

**Step 3:** Use it:
```html
<div class="bg-info text-info-foreground p-4 rounded">
  ℹ️ This is an info message
</div>
```

### Changing the Font

**To add a custom font (e.g., Google Fonts):**

**Step 1:** Import the font in `layout.tsx`:
```typescript
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

**Step 2:** Update `globals.css`:
```css
@theme inline {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

**Note:** This will add network requests for fonts. Only do if branding requires it.

---

## Summary

### What We Built

| Component | Purpose |
|-----------|---------|
| CSS Variables | Single source of truth for all design values |
| Color System | Primary, accent, semantic, and neutral colors |
| Typography | System font stack with no load time |
| Tailwind Theme | Custom colors available as utility classes |
| Utility Classes | Price display, container helpers |
| Base Styles | Scrollbars, focus states, transitions |

### Key Files

| File | Purpose |
|------|---------|
| `globals.css` | All design tokens and base styles |
| `agent choices.md` | Documentation of all decisions |

### Benefits Achieved

1. **Consistency** - Same colors and styles everywhere
2. **Maintainability** - Change once, update everywhere
3. **Performance** - System fonts = zero load time
4. **Accessibility** - Proper contrast ratios, focus states
5. **Developer Experience** - Use Tailwind classes like `bg-primary`

---

## What's Next?

**Step 3: Layout Components** will use this design system to build:
- Header with navigation
- Footer with store information
- Mobile navigation drawer

All components will use the colors and typography we defined here!

---

*Document created: January 5, 2026*  
*Last updated: January 5, 2026*
