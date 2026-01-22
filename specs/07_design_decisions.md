# DESIGN DECISIONS & AGENT CHOICES

Living document to track all design decisions, architectural choices, and important implementation details during development.

**Last Updated**: 2026-01-22 (Updated to reflect Phase 1 implementation through Step 9)

---

## How to Use This Document

**Purpose**: 
- Track decisions made during implementation
- Document rationale for technical choices
- Reference patterns and conventions used
- Remember important application details

**Instructions for AI Agents**:
- **Update this document** as you make decisions during implementation
- Add new sections for each major decision
- Include the date, decision made, rationale, and alternatives considered
- Keep this as a changelog of your architectural choices

**Note**: For the most current and detailed decisions, also refer to `agent choices.md` which is updated during each implementation step.

---

# IMPLEMENTED DECISIONS (Steps 1-9)

These decisions were made during actual implementation.

---

## Router Choice: App Router ✅

**Decision Date**: Step 1 (2025-12-17)
**Decision**: App Router (Next.js 14)
**Rationale**: 
- Modern, recommended by Next.js team
- Server Components by default
- Better TypeScript support
- Nested layouts support

---

## TypeScript: Enabled ✅

**Decision Date**: Step 1 (2025-12-17)
**Decision**: TypeScript with strict mode
**Implementation**:
- `tsconfig.json` with strict mode enabled
- All interfaces defined in `store/src/types/index.ts`
- Props and state properly typed

---

## Color Palette: Teal + Amber ✅

**Decision Date**: Step 2 (2025-01-05)
**Decision**: Deep Teal (#0F766E) as primary, Warm Amber (#F59E0B) as accent
**Rationale**: 
- Teal: Professional, trustworthy, more distinctive than common blue
- Amber: Warm, inviting, draws attention for CTAs
- Green for discounts: Industry standard
**Original Spec**: Blue (#2563EB) + Orange (#F97316)
**Why Changed**: More distinctive brand identity

---

## Typography: System Fonts ✅

**Decision Date**: Step 2 (2025-01-05)
**Decision**: System font stack only (no Google Fonts)
**Rationale**:
- Zero load time (fonts already on device)
- Native platform feel
- Better performance
- Can switch to custom fonts later
**Original Spec**: Inter font with Google Fonts

---

## Category Navigation: Homepage Drill-Down ✅

**Decision Date**: Step 6 (2026-01-20)
**Decision**: Categories drill-down on homepage, not separate pages
**Implementation**:
- Level 0 categories always visible on homepage
- Clicking expands subcategories below (nested)
- Products accessed via `/category/{slug}/products`
**Original Spec**: Navigate to `/categories/{slug}` pages
**Why Changed**: Simpler UX, main categories always visible

---

## Product Grid: Infinite Scroll ✅

**Decision Date**: Step 6-7 (2026-01-20)
**Decision**: Infinite scroll with SWR Infinite
**Implementation**:
- Intersection Observer with 200px margin
- 30 products per page (configurable via env var)
- Sort and brand filter via URL params
**Original Spec**: Agent's choice (infinite scroll or pagination)

---

## Mobile Header: Two-Row Layout ✅

**Decision Date**: Step 3 (2025-01-05)
**Decision**: Two-row mobile header
**Implementation**:
- Row 1: Hamburger, logo, icons
- Row 2: Full-width search bar
**Original Spec**: Single-row with search icon
**Why Changed**: Better UX for search-first use case

---

## Authentication: Dedicated Page + localStorage ✅

**Decision Date**: Step 9 (2026-01-21)
**Decision**: Dedicated `/login` page, token in localStorage
**Implementation**:
- Full-page login experience at `/login`
- OTP input as 6 individual boxes
- Token stored in localStorage
- New user name input step
**Original Spec**: Modal OR page, httpOnly cookies recommended
**Why Changed**: Simpler for Phase 1 mock implementation

---

## Admin Role Detection: Phone Number ✅

**Decision Date**: Step 9 (2026-01-21)
**Decision**: Admin determined by phone number
**Implementation**:
- Phone +919849067667 = ADMIN role
- All other phones = USER role
**Rationale**: Simple for Phase 1, will use database role in Phase 2

---

# PRE-IMPLEMENTATION DECISIONS (Reference)

These decisions were documented in planning but may have been modified during implementation.
// types/product.ts
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: ProductImage[];
  brand: Brand;
  category: Category;
  // ... etc
}

// types/api.ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
```

### If Choosing JavaScript:
**Benefits**:
- Faster to write
- No type compilation
- Easier for quick prototyping

**Best Practices**:
- Use JSDoc comments for type hints
- PropTypes for component validation
- Consistent naming conventions

---

## State Management Strategy

**Decision Date**: Pre-implementation
**Decision**: Progressive approach - start simple, scale as needed

**Phase 1 (Initial)**:
- **React Context API** for global state (auth, theme)
- **useState/useReducer** for component state
- **SWR** for server state (API data, caching)

**When to Upgrade**:
- Context gets complex (>3 contexts) → Zustand
- Need dev tools → Redux Toolkit
- Performance issues with Context → Zustand or Jotai

**Implementation Pattern**:
```typescript
// context/AuthContext.tsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Styling Approach

**Decision Date**: Pre-implementation
**Decision**: Tailwind CSS with shadcn/ui components

**Rationale**:
- Tailwind: Fast development, utility-first, excellent DX
- shadcn/ui: Copy-paste components (no dependency), customizable, accessible

**Alternative Considered**: 
- CSS Modules (more verbose, harder to maintain)
- styled-components (runtime overhead, harder SSR)
- Chakra UI (dependency lock-in)

**Convention to Follow**:
- Use Tailwind classes directly in JSX
- Extract repeated patterns into components
- Use shadcn/ui components as base, customize as needed
- Follow Tailwind's responsive modifiers: `md:`, `lg:`, etc.

---

## API Client Setup

**Decision Date**: Pre-implementation
**Decision**: Axios + SWR for optimal DX

**API Client** (`lib/api.ts`):
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Data Fetching with SWR**:
```typescript
// hooks/useProducts.ts
import useSWR from 'swr';
import api from '@/lib/api';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useProducts(categoryId?: string) {
  const { data, error, isLoading } = useSWR(
    categoryId ? `/products?categoryId=${categoryId}` : '/products',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );
  
  return {
    products: data?.products || [],
    isLoading,
    isError: error,
  };
}
```

---

## Authentication Flow

**Decision Date**: Pre-implementation
**Decision**: Phone OTP with JWT, localStorage for token storage

**Flow**:
1. User enters phone number
2. Frontend calls `POST /api/auth/send-otp`
3. User enters OTP
4. Frontend calls `POST /api/auth/verify-otp`
5. Backend returns JWT token
6. Frontend stores token in localStorage
7. Token included in all subsequent API requests

**Token Storage Decision**:
- **Chosen**: localStorage (simplicity for Phase 1)
- **Alternative**: httpOnly cookies (better security, requires backend setup)
- **Rationale**: localStorage easier for mock APIs, migrate to httpOnly cookies in Phase 2

**Session Management**:
- Token expiry: 30 days
- Auto-logout on token expiry
- Clear token on logout

---

## Image Handling Strategy

**Decision Date**: Pre-implementation
**Decision**: Next.js Image component for all images, S3 URLs in mock data

**Configuration**:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: [
      's3.amazonaws.com',
      'new-guru-enterprises.s3.ap-south-1.amazonaws.com',
      'localhost', // For local development
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

**Component Pattern**:
```typescript
// components/ProductImage.tsx
import Image from 'next/image';

export function ProductImage({ src, alt, priority = false }) {
  return (
    <div className="relative aspect-square">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  );
}
```

---

## Mock Data Structure

**Decision Date**: Pre-implementation
**Decision**: JSON files in `/mock_data`, structured to match backend schema

**Files to Create**:
- `categories.json` - Hierarchical category tree
- `products.json` - All products with variants
- `brands.json` - Brand information
- `banners.json` - Homepage banners
- `users.json` - Mock user accounts (for admin login)

**Relationships**:
- Products reference category IDs and brand IDs
- Mock API endpoints join data on-the-fly
- Maintain data consistency (valid foreign keys)

---

## Form Validation Strategy

**Decision Date**: Pre-implementation
**Decision**: React Hook Form + Zod for type-safe validation

**Installation**:
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Pattern**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  phone: z.string().regex(/^\+91[0-9]{10}$/, 'Invalid phone'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  
  // ...
}
```

---

## Error Handling Pattern

**Decision Date**: Pre-implementation
**Decision**: Consistent error format, toast notifications for user feedback

**Error Response Format** (from API):
```typescript
{
  success: false,
  error: "Product not found",
  code: "NOT_FOUND",
  statusCode: 404
}
```

**Frontend Error Handling**:
```typescript
// Use shadcn/ui toast
import { useToast } from '@/components/ui/use-toast';

const { toast } = useToast();

try {
  await api.post('/wishlist', { productId });
  toast({
    title: 'Success',
    description: 'Added to wishlist',
  });
} catch (error) {
  toast({
    title: 'Error',
    description: error.response?.data?.error || 'Something went wrong',
    variant: 'destructive',
  });
}
```

---

## Loading States

**Decision Date**: Pre-implementation
**Decision**: Spinners for Phase 1, skeleton loaders for Phase 2

**Phase 1 (Spinners)**:
```typescript
// components/ui/spinner.tsx
export function Spinner({ size = 'md' }) {
  return (
    <div className={`animate-spin rounded-full border-t-2 border-primary ${sizeClasses[size]}`} />
  );
}

// Usage
{isLoading ? <Spinner /> : <ProductGrid products={products} />}
```

**Phase 2 (Skeleton Loaders)**:
```typescript
// components/ui/skeleton.tsx (shadcn/ui)
import { Skeleton } from '@/components/ui/skeleton';

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
```

---

## Routing Strategy

**Decision Date**: Pre-implementation
**Decision**: SEO-friendly URLs with slugs

> **Implementation Note**: Category navigation uses homepage drill-down pattern.
> Products are listed at `/category/[slug]/products` for leaf categories.

**URL Structure (Implemented)**:
```
Homepage:              /
Category Products:     /category/[slug]/products  (e.g., /category/3-jar/products)
Product Detail:        /products/[slug]           (e.g., /products/prestige-cooker-2l)
Wishlist:              /wishlist
Login:                 /login
```

**URL Structure (Future - Admin)**:
```
Admin Dashboard:       /admin
Admin Products:        /admin/products
Admin Add Product:     /admin/products/new
Admin Edit Product:    /admin/products/[id]/edit
```

**Slug Generation**:
- Lowercase, hyphenated
- Remove special characters
- Ensure uniqueness (append ID if needed)

---

## Responsive Breakpoints

**Decision Date**: Pre-implementation
**Decision**: Mobile-first, Tailwind default breakpoints

**Breakpoints**:
```
sm:  640px  (Large mobile)
md:  768px  (Tablet)
lg:  1024px (Desktop)
xl:  1280px (Large desktop)
2xl: 1536px (Extra large)
```

**Approach**:
- Design mobile first (default styles)
- Add `md:` prefix for tablet adjustments
- Add `lg:` prefix for desktop layouts

**Example**:
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* 2 columns mobile, 3 tablet, 4 desktop */}
</div>
```

---

## Admin vs User Layout

**Decision Date**: Pre-implementation
**Decision**: Separate layouts for admin and user-facing pages

**User Layout**:
- Sticky header with logo, search, wishlist, login
- Footer with contact info
- Mobile: Bottom navigation (optional)

**Admin Layout**:
- Sidebar navigation (collapsible)
- Top bar with admin name, logout
- Breadcrumbs for navigation context
- No footer

**Implementation**:
```typescript
// app/layout.tsx (user layout)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/admin/layout.tsx (admin layout)
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <AdminHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}
```

---

## Search Implementation

**Decision Date**: Pre-implementation
**Decision**: Client-side search in Phase 1, server-side in Phase 2

**Phase 1 (Mock API)**:
- Search products by name (case-insensitive)
- Filter by category, brand
- Simple string matching

**Phase 2 (Backend API)**:
- Full-text search with PostgreSQL trigram
- Search across product name, SKU, brand
- Relevance ranking

**UI Component**:
```typescript
// components/SearchBar.tsx
export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };
  
  return (
    <form onSubmit={handleSearch}>
      <Input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
    </form>
  );
}
```

---

## Wishlist Implementation

**Decision Date**: Pre-implementation
**Decision**: localStorage for guests, API for authenticated users

**Guest Users**:
```typescript
// lib/wishlist.ts
export function getGuestWishlist(): string[] {
  const items = localStorage.getItem('wishlist');
  return items ? JSON.parse(items) : [];
}

export function addToGuestWishlist(productId: string) {
  const items = getGuestWishlist();
  if (!items.includes(productId)) {
    items.push(productId);
    localStorage.setItem('wishlist', JSON.stringify(items));
  }
}
```

**Authenticated Users**:
- Call `POST /api/wishlist` to add
- Fetch with `GET /api/wishlist`
- Sync guest wishlist on login

**Sync on Login**:
```typescript
const guestItems = getGuestWishlist();
if (guestItems.length > 0) {
  await api.post('/api/wishlist/bulk', { productIds: guestItems });
  localStorage.removeItem('wishlist');
}
```

---

## Environment Variables

**Decision Date**: Pre-implementation
**Decision**: `.env.local` for local dev, Vercel dashboard for production

**Required Variables**:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=new-guru-enterprises
```

**Naming Convention**:
- `NEXT_PUBLIC_*` for client-exposed variables
- No prefix for server-only variables

---

# IMPLEMENTATION DECISIONS

Use this section to document decisions made during actual coding.

---

## [Template for New Decisions]

**Decision Date**: YYYY-MM-DD
**Component/Feature**: What you're implementing
**Decision**: What you chose to do
**Rationale**: Why you made this choice
**Code Example** (if applicable):
```typescript
// Your implementation
```
**Notes**: Any important details for future reference

---

## Example: Product Tile Component

**Decision Date**: 2024-01-XX (Example - replace when implementing)
**Component/Feature**: ProductTile reusable component
**Decision**: Single component with variants for grid vs list view

**Implementation**:
```typescript
// components/product/ProductTile.tsx
interface ProductTileProps {
  product: Product;
  variant?: 'grid' | 'list';
}

export function ProductTile({ product, variant = 'grid' }: ProductTileProps) {
  if (variant === 'list') {
    return <ProductListView product={product} />;
  }
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <ProductImage src={product.images[0].url} alt={product.name} />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-lg text-primary">₹{product.price}</p>
      <WishlistButton productId={product.id} />
    </div>
  );
}
```

**Rationale**: 
- Single source of truth for product display
- Easy to maintain and update styling
- Reusable across multiple pages

**Trade-offs**:
- Slightly more complex than separate components
- But better consistency and maintainability

---

# PATTERNS & CONVENTIONS

Document established patterns to maintain consistency.

---

## Component Naming

**Convention**: PascalCase for components, camelCase for utilities

**Examples**:
- `ProductTile.tsx` (component)
- `ProductDetailPage.tsx` (page component)
- `useProducts.ts` (custom hook)
- `api.ts` (utility)

---

## File Organization

**Convention**: Group by feature, not by type

**Good**:
```
components/
  product/
    ProductTile.tsx
    ProductCard.tsx
    ProductImage.tsx
  category/
    CategoryCard.tsx
    CategoryTree.tsx
```

**Avoid**:
```
components/
  cards/
    ProductCard.tsx
    CategoryCard.tsx
  images/
    ProductImage.tsx
```

---

## Import Order

**Convention**: 
1. React/Next imports
2. Third-party libraries
3. Local components
4. Utilities/helpers
5. Types
6. Styles

**Example**:
```typescript
import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { ProductTile } from '@/components/product/ProductTile';
import { SearchBar } from '@/components/SearchBar';

import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

import type { Product } from '@/types/product';
```

---

## API Endpoint Naming

**Convention**: RESTful, plural nouns

**Examples**:
- `GET /api/products` - List products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

---

## Component Props

**Convention**: Explicit interfaces for all component props

**Example**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  disabled = false 
}: ButtonProps) {
  // ...
}
```

---

## Error Messages

**Convention**: User-friendly messages, not technical jargon

**Good**:
- "Phone number is required"
- "Product not found"
- "Unable to add to wishlist. Please try again."

**Avoid**:
- "Validation error: phone field is null"
- "404 Not Found"
- "Network request failed with status 500"

---

## Loading States

**Convention**: Show spinner/skeleton immediately, minimum 300ms display

**Pattern**:
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await api.post('/endpoint', data);
  } finally {
    // Small delay for better UX (avoid flash)
    setTimeout(() => setIsLoading(false), 300);
  }
};
```

---

# IMPORTANT REMINDERS

Things to remember throughout development.

---

## Data Consistency

- **Categories**: Max 3 levels (Level 0 → Level 1 → Level 2)
- **Product Variants**: Share same parent product group
- **Slugs**: Must be unique across products
- **Phone Numbers**: Always include country code (+91)
- **Prices**: Store in paisa (₹100 = 10000), display formatted
- **Images**: Square aspect ratio (1:1) for product images

---

## Security Checklist

Every form submission:
- [ ] Validate input on client
- [ ] Sanitize input before API call
- [ ] Handle errors gracefully
- [ ] Show user-friendly messages

Every API call:
- [ ] Include auth token if required
- [ ] Handle 401 (redirect to login)
- [ ] Handle 403 (show access denied)
- [ ] Handle network errors

---

## Performance Checklist

Every new page:
- [ ] Use `next/image` for all images
- [ ] Lazy load below-fold content
- [ ] Add proper meta tags (title, description)
- [ ] Test mobile performance
- [ ] Check Lighthouse score

Every component:
- [ ] Avoid unnecessary re-renders (memo if needed)
- [ ] Use proper keys in lists
- [ ] Clean up effects (return cleanup function)

---

## Accessibility Checklist

Every interactive element:
- [ ] Keyboard accessible (tab navigation)
- [ ] ARIA labels for screen readers
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

Every form:
- [ ] Labels associated with inputs
- [ ] Error messages announced
- [ ] Required fields marked
- [ ] Submit feedback (success/error)

---

## Testing Checklist

Before marking feature complete:
- [ ] Test on mobile (Chrome DevTools mobile view)
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Test with slow network (throttle in DevTools)
- [ ] Test error states (network failure, 404, etc.)
- [ ] Test loading states
- [ ] Test empty states (no products, no results)

---

# VERSION CONTROL

## Commit Message Convention

**Format**: `type(scope): message`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructure
- `test`: Add tests
- `chore`: Build/config changes

**Examples**:
- `feat(product): add product detail page`
- `fix(wishlist): resolve duplicate items issue`
- `docs(readme): update installation instructions`
- `style(header): improve mobile navigation styling`

---

## Branch Strategy

**Main Branches**:
- `main` - Production-ready code
- `develop` - Integration branch

**Feature Branches**:
- `feature/product-listing`
- `feature/admin-dashboard`
- `fix/wishlist-bug`

**Workflow**:
1. Create feature branch from `develop`
2. Implement feature
3. Test thoroughly
4. Create PR to `develop`
5. After review, merge to `develop`
6. Periodically merge `develop` to `main`

---

**End of Design Decisions** - Update this document as you make implementation choices during development.
