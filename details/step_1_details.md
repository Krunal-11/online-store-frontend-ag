# STEP 1: PROJECT SETUP AND CONFIGURATION - DETAILED BREAKDOWN

**Date Completed**: December 17, 2025  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [Next.js Project Creation](#nextjs-project-creation)
3. [Dependencies Installed](#dependencies-installed)
4. [Folder Structure](#folder-structure)
5. [Configuration Files](#configuration-files)
6. [Core Files Created](#core-files-created)
7. [Mock Data Structure](#mock-data-structure)
8. [Key Concepts Explained](#key-concepts-explained)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Step 1 established the foundation of the entire application. We created a modern Next.js project with all necessary tools and structure to build a catalog-first e-commerce application.

**What was accomplished:**
- ✅ Next.js 16 project with App Router
- ✅ TypeScript configuration with strict mode
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui component library (17 components)
- ✅ Complete folder structure
- ✅ Custom hooks for data fetching
- ✅ Mock data (categories, products, brands)
- ✅ Authentication context setup
- ✅ API client with axios interceptors

---

## Next.js Project Creation

### Command Used
```bash
npx create-next-app@latest store --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git --use-npm --no-turbopack
```

### What Each Flag Means

| Flag | Purpose | Why We Used It |
|------|---------|----------------|
| `--typescript` | Enable TypeScript | Type safety, better IDE support, catch errors at compile time |
| `--tailwind` | Install Tailwind CSS | Utility-first CSS framework for rapid UI development |
| `--eslint` | Setup ESLint | Code quality and consistency checking |
| `--app` | Use App Router | Modern Next.js routing (vs Pages Router) - supports React Server Components |
| `--src-dir` | Create `src/` directory | Keeps project root clean, separates source code from config files |
| `--import-alias "@/*"` | Setup path alias | Write `@/components/Button` instead of `../../../components/Button` |
| `--no-git` | Skip Git initialization | You wanted to initialize Git yourself with different credentials |
| `--use-npm` | Use npm (not yarn/pnpm) | Package manager choice |
| `--no-turbopack` | Disable Turbopack | Avoid beta features initially |

### What Next.js Includes by Default

After running `create-next-app`, the project includes:

1. **Next.js Framework** (v16.0.10)
   - Server-side rendering (SSR)
   - Static site generation (SSG)
   - API routes capability
   - Image optimization
   - File-based routing

2. **React** (v19)
   - UI library for building components
   - Hooks for state management
   - Server Components support

3. **TypeScript**
   - Static type checking
   - Better autocomplete in VS Code
   - Interfaces and type definitions

4. **Tailwind CSS**
   - Utility classes for styling
   - Responsive design built-in
   - Custom theme configuration

5. **ESLint**
   - Code linting
   - Next.js specific rules
   - Code quality enforcement

---

## Dependencies Installed

### Additional Packages We Added

```bash
npm install swr axios react-hook-form zod @hookform/resolvers lucide-react embla-carousel-react
```

#### What Each Package Does

**1. SWR** (`swr`)
- **Purpose**: Data fetching and caching
- **Why**: Automatic revalidation, caching, real-time updates
- **Usage**: Fetch product data from APIs
```typescript
const { data, error, isLoading } = useSWR('/api/products', fetcher);
```

**2. Axios** (`axios`)
- **Purpose**: HTTP client for API calls
- **Why**: Better than fetch() - interceptors, automatic JSON parsing, error handling
- **Usage**: All API requests go through axios
```typescript
const response = await api.get('/products');
```

**3. React Hook Form** (`react-hook-form`)
- **Purpose**: Form handling and validation
- **Why**: Performance (uncontrolled inputs), easy validation, less re-renders
- **Usage**: Login forms, admin product forms
```typescript
const { register, handleSubmit } = useForm();
```

**4. Zod** (`zod`)
- **Purpose**: Schema validation
- **Why**: TypeScript-first validation, runtime type checking
- **Usage**: Validate form inputs
```typescript
const schema = z.object({
  phone: z.string().regex(/^\+91[0-9]{10}$/),
});
```

**5. @hookform/resolvers**
- **Purpose**: Connect Zod with React Hook Form
- **Why**: Type-safe form validation
```typescript
const { register } = useForm({
  resolver: zodResolver(schema)
});
```

**6. Lucide React** (`lucide-react`)
- **Purpose**: Icon library
- **Why**: Modern, clean icons, tree-shakeable (only import what you use)
- **Usage**: Heart icon for wishlist, Search icon, Menu icon
```typescript
import { Heart, Search, Menu } from 'lucide-react';
```

**7. Embla Carousel** (`embla-carousel-react`)
- **Purpose**: Carousel/slider component
- **Why**: Lightweight, touch-friendly, accessible
- **Usage**: Homepage banner carousel, product image gallery
```typescript
const [emblaRef] = useEmblaCarousel({ loop: true });
```

---

## shadcn/ui Setup

### Initialization
```bash
npx shadcn@latest init -d
```

This created `components.json` configuration file.

### Components Installed

We installed 17 components in one go:

```bash
npx shadcn@latest add button input card badge avatar dialog sheet dropdown-menu accordion sonner carousel skeleton separator label textarea select checkbox -y
```

#### What Each Component Is For

| Component | Purpose | Used In |
|-----------|---------|---------|
| **button** | Clickable buttons with variants | All CTAs, forms, navigation |
| **input** | Text input fields | Search, login, forms |
| **card** | Container with shadow/border | Product tiles, category cards |
| **badge** | Small labels/tags | Discount badges, status indicators |
| **avatar** | User profile images | User menu, admin panel |
| **dialog** | Modal popups | Login modal, confirmations |
| **sheet** | Slide-out drawer | Mobile menu |
| **dropdown-menu** | Dropdown menus | User menu, filters |
| **accordion** | Collapsible sections | Product details, FAQs |
| **sonner** | Toast notifications | Success/error messages |
| **carousel** | Image slider | Homepage banners, product gallery |
| **skeleton** | Loading placeholders | Shimmer effect while loading |
| **separator** | Horizontal/vertical line | Section dividers |
| **label** | Form labels | Input field labels |
| **textarea** | Multi-line text input | Product descriptions |
| **select** | Dropdown select | Category selection, filters |
| **checkbox** | Checkbox input | Filters, admin forms |

### Why shadcn/ui?

**Advantages:**
1. **Copy-paste components** - No dependency, code lives in your project
2. **Full customization** - Modify any component as needed
3. **Tailwind-based** - Consistent with our styling approach
4. **Accessible** - Built with ARIA attributes
5. **TypeScript** - Fully typed

**How it works:**
- Components are copied to `src/components/ui/`
- You own the code (not a black box)
- Can modify styling and behavior freely

---

## Folder Structure

### Complete Directory Tree

```
store/
├── .env.local                 # Environment variables (API URLs, credentials)
├── .env.example              # Template for .env.local
├── .git/                     # Git repository (auto-created)
├── .gitignore               # Files to ignore in git
├── .next/                   # Next.js build output (generated)
├── components.json          # shadcn/ui configuration
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── next-env.d.ts           # Next.js TypeScript declarations
├── node_modules/           # Installed packages
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Locked dependency versions
├── postcss.config.mjs      # PostCSS configuration (for Tailwind)
├── public/                 # Static files (images, fonts)
├── README.md               # Project documentation
├── tsconfig.json          # TypeScript configuration
└── src/                   # Source code
    ├── app/               # Next.js App Router (pages)
    │   ├── layout.tsx     # Root layout (wraps all pages)
    │   ├── page.tsx       # Homepage (/)
    │   └── globals.css    # Global styles
    ├── components/        # React components
    │   └── ui/           # shadcn/ui components (17 components)
    ├── context/          # React Context providers
    │   ├── AuthContext.tsx
    │   └── index.ts
    ├── hooks/            # Custom React hooks
    │   ├── useProducts.ts
    │   ├── useCategories.ts
    │   ├── useWishlist.ts
    │   └── index.ts
    ├── lib/              # Utility functions
    │   ├── api.ts        # Axios instance with interceptors
    │   └── utils.ts      # Helper functions (created by shadcn)
    ├── mock_data/        # JSON mock data
    │   ├── categories.json
    │   ├── brands.json
    │   ├── products.json
    │   ├── banners.json
    │   └── users.json
    └── types/            # TypeScript type definitions
        └── index.ts
```

### Purpose of Each Top-Level Folder

#### `src/app/`
- **What**: Next.js 13+ App Router pages
- **How it works**: File-based routing
  - `app/page.tsx` → `/` (homepage)
  - `app/products/page.tsx` → `/products`
  - `app/products/[id]/page.tsx` → `/products/123` (dynamic route)
- **Key files**:
  - `layout.tsx` - Wraps all pages (header, footer go here)
  - `page.tsx` - Actual page content
  - `globals.css` - Global styles

#### `src/components/`
- **What**: Reusable React components
- **Structure**:
  - `ui/` - shadcn/ui base components (button, input, etc.)
  - (Will add) `ProductCard.tsx`, `Header.tsx`, `Footer.tsx`, etc.

#### `src/context/`
- **What**: React Context API for global state
- **Why**: Share data across components without prop drilling
- **Example**: AuthContext stores user login state

#### `src/hooks/`
- **What**: Custom React hooks for reusable logic
- **Why**: Encapsulate data fetching and state management
- **What we created**:
  - `useProducts.ts` - Fetch product data
  - `useCategories.ts` - Fetch categories
  - `useWishlist.ts` - Manage wishlist

#### `src/lib/`
- **What**: Utility functions and configurations
- **Key file**: `api.ts` - Axios instance for all API calls

#### `src/mock_data/`
- **What**: JSON files simulating backend data
- **Why**: Develop without a real backend (Phase 1)
- **What's inside**: Products, categories, brands, banners, users

#### `src/types/`
- **What**: TypeScript type definitions
- **Why**: Share types across the application
- **What's inside**: Product, Category, Brand, User interfaces

---

## Configuration Files

### 1. `tsconfig.json` - TypeScript Configuration

```jsonc
{
  "compilerOptions": {
    "target": "ES2017",           // JavaScript version to compile to
    "lib": ["dom", "dom.iterable", "esnext"],  // Libraries available
    "strict": true,                // Enable all strict type checking
    "skipLibCheck": true,          // Skip type checking of declaration files
    "noEmit": true,                // Don't emit JavaScript (Next.js handles this)
    "esModuleInterop": true,       // Enable CommonJS/ES6 module interop
    "module": "esnext",            // Module system
    "moduleResolution": "bundler", // How to resolve modules
    "resolveJsonModule": true,     // Allow importing JSON files
    "isolatedModules": true,       // Each file is a separate module
    "jsx": "react-jsx",            // JSX compilation mode
    "paths": {
      "@/*": ["./src/*"]           // Path alias: @ = src/
    }
  }
}
```

**Key Settings Explained:**
- `strict: true` - Catches more errors at compile time
- `paths: {"@/*": ["./src/*"]}` - Use `@/` instead of relative paths

### 2. `next.config.ts` - Next.js Configuration

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,  // Enable React Compiler (experimental)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',  // Allow S3 images
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',  // Faster dev builds
  },
};

export default nextConfig;
```

**Key Settings:**
- `images.remotePatterns` - Allow external images from S3
- `unoptimized` in dev - Faster development, optimize in production

### 3. `components.json` - shadcn/ui Configuration

```json
{
  "style": "new-york",          // shadcn style variant
  "rsc": true,                  // React Server Components support
  "tsx": true,                  // Use TypeScript
  "tailwind": {
    "baseColor": "neutral",     // Base color scheme
    "cssVariables": true        // Use CSS variables for theming
  },
  "iconLibrary": "lucide",      // Use Lucide icons
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### 4. `.env.local` - Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=/api

# Store Information
NEXT_PUBLIC_STORE_NAME="New Guru Enterprises"
NEXT_PUBLIC_STORE_PHONE="9849067667"
NEXT_PUBLIC_STORE_ADDRESS="No. 5-4-726/1, Nampally Station Road ABIDS SOUTH Hyderabad, Telangana, 500001 India"

# Admin Credentials (Phase 1 only)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Why `NEXT_PUBLIC_` prefix?**
- Variables with this prefix are accessible in the browser
- Without it, only accessible on server-side
- Use for API URLs, public info
- DON'T use for secrets (API keys, passwords)

---

## Core Files Created

### 1. `src/lib/api.ts` - Axios HTTP Client

**Purpose**: Centralized API client for all HTTP requests

**Key Features:**

1. **Base Configuration**
```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,  // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

2. **Request Interceptor** (adds auth token)
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**What this does:**
- Before every API call, check for auth token
- If found, add it to request headers
- Backend can verify the token

3. **Response Interceptor** (handles errors)
```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token, redirect to login
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);
```

**What this does:**
- If API returns 401 (unauthorized), clear the token
- User will be logged out automatically

**Usage Example:**
```typescript
// In any component/hook
import api from '@/lib/api';

const response = await api.get('/products');
const products = response.data;
```

---

### 2. `src/types/index.ts` - TypeScript Interfaces

**Purpose**: Define the shape of all data structures

**Why TypeScript Types Matter:**
- Autocomplete in VS Code
- Catch errors before runtime
- Self-documenting code

**Key Types Defined:**

#### Product Types
```typescript
export interface Product {
  id: string;
  productGroupId: string;
  sku: string;              // Stock Keeping Unit (unique identifier)
  name: string;             // Variant name (e.g., "2 Litre")
  slug: string;             // URL-friendly name
  mrp: number;              // Maximum Retail Price
  sellingPrice: number;     // Actual selling price
  discountPercentage: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  isDefaultVariant: boolean;
  attributes: Record<string, string>;  // Key-value pairs (color, size, etc.)
  createdAt: string;
  updatedAt: string;
}
```

**Key Concepts:**
- **Product Group** = A product with multiple variants (e.g., Pressure Cooker)
- **Product/Variant** = Specific variation (e.g., 2L, 3L, 5L)
- Each variant has its own price, SKU, images

#### Category Types
```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;  // null for top-level categories
  level: number;            // 0 = main, 1 = sub, 2 = sub-sub
  path: string;             // "electronics/mixer-grinder/3-jar"
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  children?: Category[];    // Nested subcategories
}
```

**Hierarchical Structure:**
- Level 0: Electronics, Kitchen Essentials (main categories)
- Level 1: Mixer Grinder, Pressure Cooker (subcategories)
- Level 2: 3 Jar, 4 Jar (sub-subcategories)

#### API Response Types
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**Generic Type `<T>`:**
- Can be any type: `ApiResponse<Product[]>`, `ApiResponse<User>`
- Ensures type safety in responses

---

### 3. `src/hooks/useProducts.ts` - Product Data Fetching

**Purpose**: Custom hook to fetch product data with SWR

**What is a Custom Hook?**
- Reusable function starting with `use`
- Can use other React hooks inside
- Encapsulates complex logic

**Hook 1: useProducts**
```typescript
export function useProducts(params?: {
  categoryId?: string;
  brandId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<ProductListItem>>(
    `/products?categoryId=${params?.categoryId}`,
    fetcher
  );

  return {
    products: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    mutate,  // Manually refresh data
  };
}
```

**Usage in a Component:**
```typescript
function ProductGrid() {
  const { products, isLoading } = useProducts({ categoryId: 'electronics' });
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

**How SWR Works:**
1. Fetches data from API
2. Caches the result
3. Returns cached data instantly on next render
4. Revalidates in background
5. Updates if data changed

**Hook 2: useProduct** (single product)
```typescript
export function useProduct(slugOrId: string | undefined) {
  const { data, error, isLoading } = useSWR<ApiResponse<ProductWithDetails>>(
    slugOrId ? `/products/${slugOrId}` : null,  // null = don't fetch yet
    fetcher
  );

  return {
    product: data?.data,
    isLoading,
    isError: !!error,
  };
}
```

**Conditional Fetching:**
- If `slugOrId` is undefined, SWR doesn't fetch
- Useful when ID comes from route params

---

### 4. `src/hooks/useCategories.ts` - Category Data Fetching

**Hook: useMainCategories**
```typescript
export function useMainCategories() {
  const { categories, isLoading } = useCategories();
  
  // Filter to only level 0 (main) categories
  const mainCategories = categories.filter((cat) => cat.level === 0);

  return {
    categories: mainCategories,
    isLoading,
  };
}
```

**Usage:**
```typescript
function HomePage() {
  const { categories } = useMainCategories();
  
  return (
    <div className="grid grid-cols-3">
      {categories.map(cat => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
}
```

---

### 5. `src/hooks/useWishlist.ts` - Wishlist Management

**Hook: useWishlist**
```typescript
export function useWishlist() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<WishlistItem[]>>(
    '/wishlist',
    fetcher
  );

  return {
    items: data?.data ?? [],
    totalItems: data?.totalItems ?? 0,
    mutate,  // Refresh wishlist after add/remove
  };
}
```

**Function: addToWishlist**
```typescript
export async function addToWishlist(productGroupId: string, variantId: string) {
  const response = await api.post('/wishlist', { productGroupId, variantId });
  return response.data;
}
```

**Usage:**
```typescript
function ProductPage() {
  const { items, mutate } = useWishlist();
  
  const handleAddToWishlist = async () => {
    await addToWishlist(productGroupId, variantId);
    mutate();  // Refresh wishlist count
  };
  
  return <button onClick={handleAddToWishlist}>Add to Wishlist</button>;
}
```

**Optimistic Updates:**
- Show UI change immediately
- Update actual data in background
- Revert if API call fails

---

### 6. `src/context/AuthContext.tsx` - Authentication State

**Purpose**: Global authentication state management

**What is React Context?**
- Share state across multiple components
- Avoid "prop drilling" (passing props through many levels)
- Alternative to Redux for simpler cases

**AuthContext Provides:**
```typescript
interface AuthContextType {
  user: User | null;              // Current logged-in user
  isAuthenticated: boolean;       // Is user logged in?
  isLoading: boolean;             // Checking auth status?
  login: (phone, otp) => Promise;
  logout: () => void;
  updateProfile: (data) => Promise;
  sendOtp: (phone) => Promise;
}
```

**How It Works:**

1. **Provider wraps the app** (in `layout.tsx`):
```typescript
<AuthProvider>
  <YourApp />
</AuthProvider>
```

2. **Components use the hook**:
```typescript
function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout {user.name}</button>
      ) : (
        <button>Login</button>
      )}
    </div>
  );
}
```

**Token Storage:**
```typescript
// After successful login
localStorage.setItem('auth_token', response.data.token);

// Auto-check on app load
useEffect(() => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    // Verify token with API
    fetchCurrentUser();
  }
}, []);
```

---

## Mock Data Structure

### 1. `categories.json` - 5 Main Categories

**Structure:**
```json
{
  "id": "cat-electronics",
  "name": "Electronics",
  "slug": "electronics",
  "level": 0,
  "path": "electronics",
  "displayOrder": 1,
  "status": "ACTIVE",
  "productCount": 8,
  "children": [
    {
      "id": "cat-mixer-grinder",
      "name": "Mixer Grinder",
      "level": 1,
      "path": "electronics/mixer-grinder",
      "children": [
        {
          "id": "cat-mixer-3jar",
          "name": "3 Jar",
          "level": 2,
          "path": "electronics/mixer-grinder/3-jar"
        }
      ]
    }
  ]
}
```

**Hierarchy:**
```
Electronics (Level 0)
├── Mixer Grinder (Level 1)
│   ├── 3 Jar (Level 2)
│   └── 4 Jar (Level 2)
└── Fans (Level 1)

Kitchen Essentials (Level 0)
├── Pressure Cooker (Level 1)
└── Cookware (Level 1)

Home Appliances (Level 0)
├── Water Purifier (Level 1)
└── Iron (Level 1)

Storage & Organization (Level 0)

Dining & Serve (Level 0)
```

### 2. `brands.json` - 5 Brands

```json
{
  "id": "brand-prestige",
  "name": "Prestige",
  "slug": "prestige",
  "description": "India's most trusted kitchen appliance brand",
  "status": "ACTIVE",
  "productCount": 6
}
```

**Brands:**
1. Prestige (6 products)
2. Bajaj (4 products)
3. Philips (4 products)
4. Hawkins (3 products)
5. Milton (3 products)

### 3. `products.json` - 20 Products with Variants

**Structure:**
```json
{
  "productGroups": [
    {
      "id": "pg-prestige-mixer-iris",
      "name": "Prestige Iris Mixer Grinder",
      "slug": "prestige-iris-mixer-grinder",
      "description": "...",
      "categoryId": "cat-mixer-grinder",
      "brandId": "brand-prestige",
      "averageRating": 4.5,
      "totalReviews": 128,
      "isFeatured": true
    }
  ],
  "products": [
    {
      "id": "prod-prestige-iris-750w-3jar",
      "productGroupId": "pg-prestige-mixer-iris",
      "sku": "PRES-IRIS-750-3J",
      "name": "750W - 3 Jar",
      "mrp": 5995,
      "sellingPrice": 4499,
      "discountPercentage": 25,
      "isDefaultVariant": true,
      "attributes": {
        "Power": "750W",
        "Jars": "3",
        "Color": "White & Blue"
      }
    }
  ],
  "productImages": [
    {
      "id": "img-1",
      "productId": "prod-prestige-iris-750w-3jar",
      "url": "/images/products/prestige-iris-3jar-1.jpg",
      "isPrimary": true,
      "displayOrder": 1
    }
  ]
}
```

**Products Created:**
1. Prestige Iris Mixer (2 variants: 3-jar, 4-jar)
2. Bajaj Rex Mixer (2 variants: 500W, 750W)
3. Philips HL7756 Mixer (2 variants: 3-jar, 4-jar)
4. Prestige Deluxe Pressure Cooker (3 variants: 2L, 3L, 5L)
5. Hawkins Contura Pressure Cooker (2 variants: 3L, 5L)
6. Bajaj Majesty Fan (2 variants: Brown, White)
7. Prestige Cookware Set (2 variants: 3-piece, 5-piece)
8. Philips AquaSure Water Purifier (1 variant)
9. Bajaj DX7 Iron (1 variant)
10. Philips Steam Iron (1 variant)
11. Milton Container Set (1 variant)
12. Hawkins Triply Kadhai (1 variant)

**Total:** 12 product groups, 20 individual variants

### 4. `banners.json` - 3 Homepage Banners

```json
{
  "id": "banner-1",
  "title": "Wide Range of Home Appliances",
  "imageUrlDesktop": "/images/banners/banner1-desktop.jpg",
  "imageUrlMobile": "/images/banners/banner1-mobile.jpg",
  "linkType": "CATEGORY",
  "linkValue": "electronics",
  "displayOrder": 1,
  "status": "ACTIVE"
}
```

**Link Types:**
- `CATEGORY` - Links to a category page
- `BRAND` - Links to brand products
- `PRODUCT` - Links to specific product
- `COLLECTION` - Links to curated collection
- `EXTERNAL` - Links to external URL

### 5. `users.json` - 2 Users

```json
{
  "id": "user-1",
  "phone": "+919876543210",
  "name": "Test User",
  "role": "USER"
}
```

**Users:**
1. Test User (role: USER)
2. Admin User (role: ADMIN, phone: +919849067667)

**Admin credentials:**
- Username: `admin`
- Password: `admin123`

---

## Key Concepts Explained

### 1. App Router vs Pages Router

**App Router** (What we're using):
```
app/
├── page.tsx              → / (homepage)
├── products/
│   └── [id]/
│       └── page.tsx      → /products/123
└── layout.tsx            → Wraps all pages
```

**Pages Router** (Old way):
```
pages/
├── index.tsx             → /
└── products/
    └── [id].tsx          → /products/123
```

**Why App Router?**
- Server Components (better performance)
- Layouts (no need to repeat header/footer)
- Loading/Error states built-in
- Better data fetching

### 2. Server Components vs Client Components

**Server Component** (default in App Router):
```typescript
// No 'use client' directive
async function ProductPage() {
  const products = await fetchProducts();  // Fetch on server
  return <div>{products.map(...)}</div>;
}
```

**Client Component** (needs interactivity):
```typescript
'use client'  // This directive makes it a client component

function ProductCard() {
  const [liked, setLiked] = useState(false);  // useState only works in client
  return <button onClick={() => setLiked(true)}>Like</button>;
}
```

**When to use Client Component:**
- useState, useEffect hooks
- Event handlers (onClick, onChange)
- Browser APIs (localStorage)

**When to use Server Component:**
- Static content
- Data fetching
- Database queries
- Better performance (smaller JS bundle)

### 3. TypeScript Generics

**What are Generics?**
- Types that work with any data type
- Like a template or placeholder

**Example:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;  // T can be anything
}

// Use it:
type ProductResponse = ApiResponse<Product>;
// data will be of type Product

type UserResponse = ApiResponse<User>;
// data will be of type User
```

**Why Useful?**
- Write once, use for any type
- Still get type safety
- Reduces code duplication

### 4. Axios Interceptors

**Request Interceptor:**
```typescript
api.interceptors.request.use((config) => {
  // Runs BEFORE every request
  console.log('Making request to:', config.url);
  config.headers.Authorization = 'Bearer ' + token;
  return config;  // Must return modified config
});
```

**Response Interceptor:**
```typescript
api.interceptors.response.use(
  (response) => {
    // Runs on successful response
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    // Runs on error response
    if (error.response.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

**Use Cases:**
- Add auth tokens automatically
- Log all requests/responses
- Handle errors globally
- Refresh expired tokens

### 5. SWR Caching

**How SWR Works:**

1. **First render** - Fetch from API
```typescript
const { data, isLoading } = useSWR('/products', fetcher);
// isLoading = true, data = undefined
```

2. **Data arrives** - Cache it
```typescript
// isLoading = false, data = [products]
```

3. **Navigate away and back**
```typescript
// Instantly shows cached data
// Then revalidates in background
```

4. **Tab focus** - Auto revalidate
```typescript
// User switches back to tab
// SWR fetches fresh data
```

**SWR Options:**
```typescript
useSWR('/products', fetcher, {
  revalidateOnFocus: true,      // Refresh when tab focused
  revalidateOnReconnect: true,  // Refresh when internet reconnects
  dedupingInterval: 2000,       // Don't refetch within 2s
  refreshInterval: 0,           // Auto-refresh every X ms (0 = disabled)
});
```

### 6. React Context Pattern

**Problem:**
```typescript
function App() {
  const [user, setUser] = useState(null);
  return <Header user={user} />;
}

function Header({ user }) {
  return <UserMenu user={user} />;
}

function UserMenu({ user }) {
  return <Avatar user={user} />;
}

function Avatar({ user }) {
  return <img src={user.avatar} />;
}
```
**Prop drilling** - passing `user` through 3 components!

**Solution with Context:**
```typescript
// 1. Create context
const AuthContext = createContext();

// 2. Provider at top level
function App() {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Header />
    </AuthContext.Provider>
  );
}

// 3. Use anywhere in tree
function Avatar() {
  const { user } = useContext(AuthContext);  // Direct access!
  return <img src={user.avatar} />;
}
```

### 7. Path Aliases

**Without alias:**
```typescript
import { Button } from '../../../components/ui/button';
import { useProducts } from '../../../../hooks/useProducts';
```

**With `@/*` alias:**
```typescript
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
```

**Configuration:**
```json
// tsconfig.json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

**Works from any file depth!**

---

## Troubleshooting

### Issue 1: Google Fonts TLS Error

**Error:**
```
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
Error while requesting Google Fonts
```

**Cause:**
- Corporate firewall/proxy blocking Google Fonts
- TLS certificate issues

**Solution:**
Removed Google Fonts, used system fonts instead:

```typescript
// Before (caused error):
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"] });

// After (works):
// No font imports
// Uses system font stack in globals.css
```

**System Font Stack:**
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Advantages:**
- No download needed
- Instant loading
- Native to user's OS
- Better performance

### Issue 2: Port Already in Use

**Error:**
```
Port 3000 is already in use
```

**Solution 1:** Kill the process
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or restart the terminal
```

**Solution 2:** Use different port
```bash
npm run dev -- -p 3001
```

### Issue 3: Module Not Found

**Error:**
```
Module not found: Can't resolve '@/components/Button'
```

**Causes:**
1. File doesn't exist
2. Wrong import path
3. TypeScript not recognizing paths

**Solutions:**
1. Check file exists: `src/components/Button.tsx`
2. Verify path alias in `tsconfig.json`
3. Restart TypeScript server (VS Code: Ctrl+Shift+P → "Restart TS Server")

### Issue 4: Type Errors

**Error:**
```typescript
Type 'string | undefined' is not assignable to type 'string'
```

**Solution:** Handle undefined case
```typescript
// Before
const product = useProduct(id);
const name: string = product.name;  // Error if product is undefined

// After
const product = useProduct(id);
const name: string = product?.name ?? 'Unknown';  // Safe
```

---

## What's Next?

**Step 2: Design System and Theme Setup**

Will configure:
1. Custom color palette (primary blue, secondary orange)
2. Typography (font sizes, weights)
3. Spacing scale
4. Border radius
5. Shadows
6. CSS variables for theming

**Step 3: Layout Components**

Will create:
1. Header with navigation
2. Footer with store info
3. Mobile menu drawer
4. Search bar component

---

## Learning Resources

**Next.js:**
- Official Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app

**TypeScript:**
- Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- Generics: https://www.typescriptlang.org/docs/handbook/2/generics.html

**React Hooks:**
- Official: https://react.dev/reference/react
- Custom Hooks: https://react.dev/learn/reusing-logic-with-custom-hooks

**Tailwind CSS:**
- Docs: https://tailwindcss.com/docs
- Cheat Sheet: https://nerdcave.com/tailwind-cheat-sheet

**shadcn/ui:**
- Components: https://ui.shadcn.com/docs/components
- Installation: https://ui.shadcn.com/docs/installation/next

**SWR:**
- Docs: https://swr.vercel.app/
- Examples: https://swr.vercel.app/examples/basic

---

## Summary

**What We Accomplished:**
✅ Created Next.js 16 project with TypeScript and Tailwind  
✅ Installed 19 additional packages  
✅ Set up shadcn/ui with 17 components  
✅ Created organized folder structure (7 directories)  
✅ Built custom hooks for data fetching  
✅ Configured authentication context  
✅ Set up API client with interceptors  
✅ Created comprehensive mock data (5 categories, 5 brands, 20 products)  
✅ Configured TypeScript with strict mode  
✅ Set up environment variables  
✅ Fixed TLS font loading issue  
✅ Verified development server runs successfully  

**Files Created:** 25+ files  
**Lines of Code:** ~2,500 lines  
**Time Taken:** ~1 hour  

**Project is ready for:** Step 2 - Design System and Theme Setup

---

*Document created: December 17, 2025*  
*Last updated: December 17, 2025*
