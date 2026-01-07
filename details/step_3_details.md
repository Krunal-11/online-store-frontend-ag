# STEP 3: LAYOUT COMPONENTS - DETAILED BREAKDOWN

**Date Completed**: January 5, 2026  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [What Are Layout Components?](#what-are-layout-components)
3. [Component Architecture](#component-architecture)
4. [Header Component Deep Dive](#header-component-deep-dive)
5. [Mobile Navigation (Sheet/Drawer)](#mobile-navigation-sheetdrawer)
6. [Footer Component](#footer-component)
7. [MainLayout Wrapper](#mainlayout-wrapper)
8. [Integrating with Next.js App Router](#integrating-with-nextjs-app-router)
9. [React Hooks Used](#react-hooks-used)
10. [Responsive Design Techniques](#responsive-design-techniques)
11. [Key Concepts Explained](#key-concepts-explained)
12. [Common Patterns](#common-patterns)

---

## Overview

Step 3 created the structural components that appear on every page - the Header, Footer, and Mobile Navigation. These "layout" components provide consistent navigation and branding across the entire application.

**What was accomplished:**
- ✅ Sticky Header with responsive design
- ✅ Desktop layout (single row)
- ✅ Mobile layout (two rows with full search)
- ✅ Mobile navigation drawer (Sheet component)
- ✅ User dropdown menu with authentication-aware states
- ✅ Wishlist count badge
- ✅ Footer with store info and contact
- ✅ MainLayout wrapper for consistent page structure
- ✅ Integration with AuthContext and hooks

**Files Created:**
```
store/src/components/layout/
├── Header.tsx       # Main navigation header
├── MobileNav.tsx    # Mobile slide-out drawer
├── Footer.tsx       # Page footer
├── MainLayout.tsx   # Layout wrapper
└── index.ts         # Barrel export file
```

**Files Modified:**
- `store/src/app/layout.tsx` - Wrapped app with AuthProvider and MainLayout
- `store/src/app/page.tsx` - Updated homepage with placeholder content

---

## What Are Layout Components?

### Definition
**Layout components** are structural React components that define the consistent parts of your application's UI - the parts that appear on every (or most) pages.

### Common Layout Components

```
┌─────────────────────────────────────────────────────┐
│                    HEADER                            │  ← Layout Component
│  Logo | Search Bar | Wishlist | User Menu           │
├─────────────────────────────────────────────────────┤
│                                                      │
│                                                      │
│                  PAGE CONTENT                        │  ← Changes per route
│                (children prop)                       │
│                                                      │
│                                                      │
├─────────────────────────────────────────────────────┤
│                    FOOTER                            │  ← Layout Component
│  Store Info | Contact | Links | Copyright           │
└─────────────────────────────────────────────────────┘
```

### Why Separate Layout Components?

1. **Reusability**: Write once, use on every page
2. **Maintainability**: Update header in one place, changes everywhere
3. **Separation of Concerns**: Layout logic separate from page content
4. **Performance**: Layout components can be optimized independently

---

## Component Architecture

### File Structure

```
components/
├── layout/              # Layout-specific components
│   ├── Header.tsx
│   ├── MobileNav.tsx
│   ├── Footer.tsx
│   ├── MainLayout.tsx
│   └── index.ts
└── ui/                  # shadcn/ui base components
    ├── button.tsx
    ├── input.tsx
    └── ...
```

### Barrel Export Pattern

The `index.ts` file acts as a "barrel" - it re-exports all components from the folder:

```typescript
// components/layout/index.ts
export { Header } from './Header';
export { Footer } from './Footer';
export { MobileNav } from './MobileNav';
export { MainLayout } from './MainLayout';
```

**Benefits:**
```typescript
// Without barrel (verbose)
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// With barrel (clean)
import { Header, Footer } from '@/components/layout';
```

---

## Header Component Deep Dive

### Structure Overview

The Header component handles both desktop and mobile layouts within a single component using Tailwind's responsive classes.

```tsx
// Simplified structure
export function Header() {
  return (
    <header className="sticky top-0 z-50">
      {/* Desktop Header - hidden on mobile */}
      <div className="hidden md:block">
        {/* Single row layout */}
      </div>

      {/* Mobile Header - hidden on desktop */}
      <div className="md:hidden">
        {/* Two row layout */}
      </div>
    </header>
  );
}
```

### Desktop Layout (Single Row)

```
┌─────────────────────────────────────────────────────────────────┐
│  New Guru Enterprises    │  🔍 Search...        │  ♡  👤 Login  │
└─────────────────────────────────────────────────────────────────┘
     Logo (left)              Search (center)        Actions (right)
```

**Code:**
```tsx
<div className="flex h-16 items-center justify-between gap-4">
  {/* Logo */}
  <Link href="/" className="flex-shrink-0 text-xl font-bold text-primary">
    New Guru Enterprises
  </Link>

  {/* Search Bar */}
  <form onSubmit={handleSearch} className="flex-1 max-w-xl">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search products..."
        className="w-full pl-10"
      />
    </div>
  </form>

  {/* Actions */}
  <div className="flex items-center gap-2">
    <Button variant="ghost" size="icon">
      <Heart className="h-5 w-5" />
    </Button>
    {/* User menu or Login button */}
  </div>
</div>
```

### Mobile Layout (Two Rows)

```
┌─────────────────────────────────────────────────┐
│ ☰  New Guru Enterprises              ♡  👤     │  Row 1
├─────────────────────────────────────────────────┤
│ 🔍 Search products...                           │  Row 2
└─────────────────────────────────────────────────┘
```

**Code:**
```tsx
<div className="md:hidden">
  {/* Row 1: Menu, Logo, Icons */}
  <div className="flex h-14 items-center justify-between gap-2">
    <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(true)}>
      <Menu className="h-5 w-5" />
    </Button>
    
    <Link href="/" className="flex-1 text-center text-lg font-bold truncate">
      New Guru Enterprises
    </Link>
    
    <div className="flex items-center gap-1">
      {/* Wishlist & User icons */}
    </div>
  </div>

  {/* Row 2: Full-width Search */}
  <div className="pb-3">
    <form onSubmit={handleSearch}>
      {/* Search input */}
    </form>
  </div>
</div>
```

### Sticky Header with Shadow

```tsx
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

return (
  <header className={`sticky top-0 z-50 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
    {/* content */}
  </header>
);
```

**Explanation:**
- `sticky top-0` - Header sticks to top when scrolling
- `z-50` - High z-index so header stays above other content
- `shadow-md` appears only when user has scrolled (visual feedback)

### User Menu with Authentication States

The header shows different UI based on login status:

```tsx
{isAuthenticated ? (
  // Logged in: Show dropdown menu
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <div>{user?.name || 'User'}</div>
      <DropdownMenuItem>My Profile</DropdownMenuItem>
      <DropdownMenuItem>My Wishlist</DropdownMenuItem>
      {user?.role === 'ADMIN' && (
        <DropdownMenuItem>Admin Panel</DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
) : (
  // Not logged in: Show Login button
  <Button variant="default" size="sm" onClick={() => router.push('/login')}>
    Login
  </Button>
)}
```

### Wishlist Badge with Count

```tsx
<Button variant="ghost" size="icon" className="relative">
  <Heart className="h-5 w-5" />
  {wishlistCount > 0 && (
    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
      {wishlistCount > 9 ? '9+' : wishlistCount}
    </Badge>
  )}
</Button>
```

**Key Points:**
- `relative` on button allows absolute positioning of badge
- Badge positioned at top-right corner with negative values
- Shows "9+" if count exceeds 9 (prevents overflow)

---

## Mobile Navigation (Sheet/Drawer)

### What is a Sheet Component?

A **Sheet** (also called Drawer or Slide-out Panel) is a UI pattern where content slides in from the edge of the screen, typically used for mobile navigation.

```
┌─────────────────────────────────────────┐
│░░░░░░░░░░░░░│                           │
│░░░ SHEET ░░░│     MAIN CONTENT         │
│░░░░░░░░░░░░░│     (dimmed overlay)     │
│░░░░░░░░░░░░░│                           │
│░░░░░░░░░░░░░│                           │
└─────────────────────────────────────────┘
     ↑ Slides in from left
```

### Using shadcn/ui Sheet

shadcn/ui provides a pre-built Sheet component based on Radix UI:

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

function MobileNav({ isOpen, onClose }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>New Guru Enterprises</SheetTitle>
        </SheetHeader>
        
        {/* Navigation content */}
      </SheetContent>
    </Sheet>
  );
}
```

**Props Explained:**
- `open` - Boolean controlling visibility
- `onOpenChange` - Callback when open state should change (e.g., clicking overlay)
- `side="left"` - Which edge the sheet slides from (left, right, top, bottom)

### Controlled vs Uncontrolled Components

**Uncontrolled** (Sheet manages its own state):
```tsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>Content</SheetContent>
</Sheet>
```

**Controlled** (Parent manages state - what we use):
```tsx
const [isOpen, setIsOpen] = useState(false);

<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent>Content</SheetContent>
</Sheet>
```

We use **controlled** because:
- Header component controls when to open the sheet
- We can close the sheet programmatically after navigation

### Navigation Item Pattern

```tsx
function NavItem({ icon, label, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-md 
                  hover:bg-secondary transition-colors text-left ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Usage
<NavItem 
  icon={<Home className="h-5 w-5" />} 
  label="Home" 
  onClick={() => handleNavigation('/')} 
/>
```

### Closing Sheet After Navigation

```tsx
const handleNavigation = (path: string) => {
  router.push(path);  // Navigate to page
  onClose();          // Close the sheet
};
```

This ensures the sheet closes when user clicks a link, improving UX.

---

## Footer Component

### Simple, Clean Structure

```tsx
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container-main py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Store Info */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">
              New Guru Enterprises
            </h3>
            <p className="text-sm text-muted-foreground">
              Wide Range of home appliances and kitchenware
            </p>
            {/* Delivery badge */}
          </div>

          {/* Column 2: Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase mb-4">Contact Us</h3>
            <a href="tel:+919849067667">+91 98490 67667</a>
            <address>No. 5-4-726/1, Nampally Station Road...</address>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase mb-4">Quick Links</h3>
            <nav>
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/categories">All Categories</FooterLink>
              {/* more links */}
            </nav>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="container-main py-4 border-t">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} New Guru Enterprises. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

### Responsive Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

| Screen Size | Columns | Layout |
|-------------|---------|--------|
| Mobile (<768px) | 1 | Stacked vertically |
| Tablet (768-1024px) | 2 | Two columns |
| Desktop (>1024px) | 3 | Three columns |

### Clickable Phone Number

```tsx
<a 
  href="tel:+919849067667" 
  className="flex items-start gap-3 hover:text-primary"
>
  <Phone className="h-4 w-4" />
  <span>+91 98490 67667</span>
</a>
```

The `tel:` protocol makes the phone number clickable on mobile devices!

### Dynamic Copyright Year

```tsx
const currentYear = new Date().getFullYear();
// Returns 2026 (current year)

<p>© {currentYear} New Guru Enterprises</p>
```

No need to manually update the year each January!

---

## MainLayout Wrapper

### Purpose

MainLayout wraps all user-facing pages to provide consistent structure:

```tsx
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
```

### Flexbox Layout Explained

```tsx
<div className="min-h-screen flex flex-col">
  <Header />           {/* Auto height */}
  <main className="flex-1">{children}</main>  {/* Grows to fill space */}
  <Footer />           {/* Auto height */}
</div>
```

- `min-h-screen` - Container is at least full viewport height
- `flex flex-col` - Stack children vertically
- `flex-1` on main - Main content grows to fill available space

**Result:** Footer always at bottom, even on short pages!

```
Short Content Page:
┌──────────────────┐
│     Header       │ ← Auto height
├──────────────────┤
│                  │
│     Content      │ ← Grows to fill
│                  │
│                  │
├──────────────────┤
│     Footer       │ ← Stays at bottom
└──────────────────┘
```

### children Prop

In React, `children` is a special prop that represents nested content:

```tsx
// Parent component
<MainLayout>
  <HomePage />  {/* This becomes 'children' */}
</MainLayout>

// Inside MainLayout
function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>  {/* HomePage renders here */}
      <Footer />
    </div>
  );
}
```

---

## Integrating with Next.js App Router

### The Root Layout

In Next.js App Router, `layout.tsx` wraps all pages in that route segment:

```tsx
// app/layout.tsx (root layout)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Provider Hierarchy

```
<html>
  <body>
    <AuthProvider>          ← Provides auth context to all children
      <MainLayout>          ← Adds Header/Footer to all pages
        {children}          ← Page content (page.tsx)
      </MainLayout>
      <Toaster />           ← Toast notifications (outside layout)
    </AuthProvider>
  </body>
</html>
```

### Why AuthProvider Wraps MainLayout?

The Header needs access to auth state (`user`, `isAuthenticated`, `logout`):

```tsx
// In Header.tsx
const { user, isAuthenticated, logout } = useAuth();
```

If AuthProvider wasn't a parent, `useAuth()` would fail!

### Toaster Outside MainLayout

The Toaster component (for toast notifications) is placed outside MainLayout:

```tsx
<AuthProvider>
  <MainLayout>{children}</MainLayout>
  <Toaster position="top-right" richColors />
</AuthProvider>
```

**Why?** Toasts should appear above everything, not scroll with the page.

---

## React Hooks Used

### 1. useState - Managing Local State

```tsx
const [searchQuery, setSearchQuery] = useState('');
const [isScrolled, setIsScrolled] = useState(false);
const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
```

**Pattern:**
```tsx
const [value, setValue] = useState(initialValue);
```

### 2. useEffect - Side Effects

```tsx
useEffect(() => {
  // This code runs after component mounts
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };
  
  // Add event listener
  window.addEventListener('scroll', handleScroll);
  
  // Cleanup function (runs when component unmounts)
  return () => window.removeEventListener('scroll', handleScroll);
}, []); // Empty array = only run once on mount
```

**Dependency Array:**
- `[]` - Run once on mount
- `[value]` - Run when `value` changes
- No array - Run on every render (avoid this!)

### 3. useRouter - Navigation

```tsx
import { useRouter } from 'next/navigation';

function Header() {
  const router = useRouter();
  
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?q=${searchQuery}`);
  };
}
```

**Methods:**
- `router.push(url)` - Navigate to URL (adds to history)
- `router.replace(url)` - Navigate without adding to history
- `router.back()` - Go back

### 4. Custom Hooks - useAuth, useWishlist

```tsx
// Using custom hooks from context
const { user, isAuthenticated, logout } = useAuth();
const { totalItems: wishlistCount } = useWishlist();
```

These hooks encapsulate complex logic:
- `useAuth` - Manages authentication state (from AuthContext)
- `useWishlist` - Fetches wishlist data (uses SWR internally)

---

## Responsive Design Techniques

### Mobile-First with Tailwind

Tailwind uses mobile-first breakpoints:

```tsx
<div className="block md:hidden">  {/* Shows on mobile only */}
<div className="hidden md:block">  {/* Shows on desktop only */}
```

**Breakpoint Reference:**
| Prefix | Min Width | Typical Devices |
|--------|-----------|-----------------|
| (none) | 0px | Mobile phones |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

### Responsive Grid Example

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
```

- Mobile: 2 columns
- Tablet: 3 columns
- Desktop: 5 columns

### Responsive Spacing

```tsx
<section className="p-4 md:p-6 lg:p-8">
```

- Mobile: 16px padding
- Tablet: 24px padding
- Desktop: 32px padding

### Text Truncation

```tsx
<Link className="text-lg font-bold truncate px-2">
  New Guru Enterprises
</Link>
```

`truncate` adds ellipsis if text is too long for container:
- "New Guru Enterprises" → "New Guru Ente..." (if space is limited)

---

## Key Concepts Explained

### 1. Client Components ('use client')

In Next.js App Router, components are Server Components by default. To use React hooks or browser APIs, add `'use client'` at the top:

```tsx
'use client';  // This directive makes it a Client Component

import { useState, useEffect } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);  // useState needs client
  // ...
}
```

**When to use 'use client':**
- Using hooks (useState, useEffect, useContext)
- Using browser APIs (window, document, localStorage)
- Adding event handlers (onClick, onChange)
- Using third-party libraries that need browser

### 2. Lucide React Icons

Lucide is a modern icon library (fork of Feather Icons):

```tsx
import { Search, Heart, User, Menu, X, Phone, MapPin } from 'lucide-react';

// Usage - icons are React components
<Search className="h-5 w-5" />
<Heart className="h-4 w-4 text-red-500" />
```

**Benefits:**
- Tree-shakeable (only imports icons you use)
- SVG-based (scales without blur)
- Easy to style with className

### 3. Tailwind Arbitrary Values

Sometimes you need a specific value not in Tailwind's defaults:

```tsx
// Fixed width sheet
<SheetContent className="w-[300px]">

// Custom positioning
<Badge className="absolute -top-1 -right-1">
```

`[300px]` is an "arbitrary value" - Tailwind generates the exact CSS you need.

### 4. Form Handling

```tsx
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();  // Prevent page refresh
  if (searchQuery.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }
};

<form onSubmit={handleSearch}>
  <Input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</form>
```

**Key Points:**
- `e.preventDefault()` - Stop form from refreshing page
- `encodeURIComponent()` - Safely encode special characters for URL
- `trim()` - Remove whitespace from start/end

### 5. Conditional Rendering

```tsx
// Using && operator
{wishlistCount > 0 && (
  <Badge>{wishlistCount}</Badge>
)}

// Using ternary operator
{isAuthenticated ? (
  <UserDropdown />
) : (
  <LoginButton />
)}

// Using && with ternary
{user?.role === 'ADMIN' && (
  <Link href="/admin">Admin Panel</Link>
)}
```

### 6. Optional Chaining (?.)

```tsx
user?.name        // Returns undefined if user is null/undefined
user?.role === 'ADMIN'  // Safe comparison
```

Without optional chaining:
```tsx
user && user.name  // More verbose
```

---

## Common Patterns

### 1. Event Handler Naming

Convention: `handle` + `EventName`

```tsx
const handleSearch = () => { ... };
const handleWishlistClick = () => { ... };
const handleLogout = () => { ... };
const handleNavigation = (path) => { ... };
```

### 2. Props Interface Pattern

```tsx
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // ...
}
```

### 3. Helper Component Pattern

Small, internal components for repeated UI:

```tsx
// Inside MobileNav.tsx
function NavItem({ icon, label, onClick, className = '' }) {
  return (
    <button onClick={onClick} className={`... ${className}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Usage
<NavItem icon={<Home />} label="Home" onClick={...} />
<NavItem icon={<Heart />} label="Wishlist" onClick={...} />
```

### 4. Semantic HTML

```tsx
// Good - semantic
<header>...</header>
<main>...</main>
<footer>...</footer>
<nav>...</nav>
<address>...</address>

// Bad - div soup
<div class="header">...</div>
<div class="main">...</div>
```

**Benefits:**
- Better accessibility (screen readers)
- Better SEO
- Clearer code intent

### 5. Link vs Button

```tsx
// Use Link for navigation
<Link href="/profile">My Profile</Link>

// Use Button for actions
<Button onClick={logout}>Logout</Button>
```

**Rule:** If it goes somewhere, use `<Link>`. If it does something, use `<button>`.

---

## Summary

### What We Built

| Component | Purpose |
|-----------|---------|
| `Header` | Navigation with search, logo, user menu |
| `MobileNav` | Slide-out navigation drawer for mobile |
| `Footer` | Store info, contact, links |
| `MainLayout` | Wrapper ensuring consistent structure |

### Key Learnings

1. **Layout components** provide consistent UI across pages
2. **Responsive design** uses Tailwind breakpoint prefixes (`md:`, `lg:`)
3. **Client Components** need `'use client'` for hooks
4. **Sheet/Drawer** pattern for mobile navigation
5. **Controlled components** let parent manage state
6. **Authentication-aware UI** shows different content based on login status

### Files to Remember

| File | When to Edit |
|------|--------------|
| `Header.tsx` | Change navigation, search, user menu |
| `MobileNav.tsx` | Update mobile menu content |
| `Footer.tsx` | Update store info, links |
| `MainLayout.tsx` | Change page structure |
| `layout.tsx` | Add providers, change HTML structure |

---

## What's Next?

**Step 4: Mock Data and API Routes** will:
- Create API routes to serve mock data
- Enable the hooks (useProducts, useCategories) to work
- Allow us to see real categories in the mobile nav

---

*Document created: January 6, 2026*  
*Last updated: January 6, 2026*
