Technical stack, performance requirements, and implementation constraints - reference this for setup and architectural decisions.

---

# TECHNICAL CONSTRAINTS

## How to Use This Document

This document defines:
- Technology stack and version requirements
- Performance benchmarks and optimization strategies
- Security requirements and best practices
- Development environment setup
- Deployment and hosting considerations

---

# TECHNOLOGY STACK

## Frontend Framework

### Next.js + React

**Version**: Next.js 14+ (App Router or Pages Router)

**Choice Rationale**:
- ✅ Server-side rendering for better SEO (product pages)
- ✅ Static site generation for category pages
- ✅ API routes for mock APIs (Phase 1)
- ✅ Built-in image optimization
- ✅ File-based routing
- ✅ Excellent performance out-of-box

**Router Recommendation**: 
- **App Router** (Next.js 13+): Modern, better for new projects
- **Pages Router**: More mature, extensive documentation
- **Agent's Choice**: Based on familiarity and project needs

**React Version**: 18+

---

## Language

### TypeScript (Recommended) or JavaScript

**Recommendation**: TypeScript

**Benefits**:
- Type safety reduces bugs
- Better IDE support and autocomplete
- Easier refactoring
- Self-documenting code

**If TypeScript**:
- Use strict mode: `"strict": true` in tsconfig.json
- Define interfaces for API responses
- Type all props and state

**If JavaScript**:
- Use JSDoc comments for type hints
- PropTypes for component validation

---

## Styling Solution

### Tailwind CSS (Recommended)

**Version**: Tailwind CSS 3+

**Benefits**:
- ✅ Utility-first approach (fast development)
- ✅ Consistent design system
- ✅ Purges unused CSS (small bundle)
- ✅ Responsive design built-in
- ✅ Works well with component libraries

**Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#DBEAFE',
        },
        secondary: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
          light: '#FFEDD5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Alternative**: CSS Modules or styled-components (agent's choice if strong preference)

---

## UI Component Library

### shadcn/ui (Primary Recommendation)

**Why shadcn/ui**:
- ✅ Tailwind-based (consistent styling)
- ✅ Copy components into project (no dependency)
- ✅ Highly customizable
- ✅ Excellent accessibility
- ✅ TypeScript support
- ✅ Modern, clean design

**Installation**:
```bash
npx shadcn-ui@latest init
```

**Components to Install** (as needed):
- Button, Input, Select, Textarea, Checkbox
- Card, Badge, Avatar
- Dialog (Modal), Sheet (Drawer)
- Dropdown Menu, Accordion
- Toast (notifications)
- Carousel (for banners, related products)

**Alternative Libraries** (if agent prefers):
- **Chakra UI**: Easy to use, good defaults
- **Ant Design**: Excellent for admin panels (complex tables/forms)
- **Material-UI**: Comprehensive, Google design language

**Recommendation**: Use shadcn/ui for both user and admin interfaces

---

## State Management

### Progressive Approach

**Phase 1**: Start Simple
- **React Context API** for global state (auth, theme)
- **useState/useReducer** for local component state
- **SWR or React Query** for server state (API data)

**When to Upgrade**:
- If Context becomes too complex → **Zustand** (lightweight)
- If app grows significantly → **Redux Toolkit** (comprehensive)

**Recommended for Phase 1**: Context + SWR

### Data Fetching: SWR (Recommended)

**Why SWR**:
- ✅ Built by Vercel (Next.js team)
- ✅ Automatic caching and revalidation
- ✅ Built-in loading/error states
- ✅ Optimistic UI updates
- ✅ Lightweight (11kb)

**Installation**:
```bash
npm install swr
```

**Example Usage**:
```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function Products() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher);
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;
  return <ProductGrid products={data.products} />;
}
```

**Alternative**: React Query (more features, larger bundle)

---

## Form Handling

### React Hook Form (Recommended)

**Why React Hook Form**:
- ✅ Excellent performance (uncontrolled components)
- ✅ Easy validation (built-in or with Zod/Yup)
- ✅ TypeScript support
- ✅ Small bundle size

**Installation**:
```bash
npm install react-hook-form
```

**With Validation** (Optional):
```bash
npm install zod @hookform/resolvers
```

**Example**:
```typescript
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    // Send OTP
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('phone', { required: true })} />
      {errors.phone && <span>Phone is required</span>}
    </form>
  );
}
```

---

## Image Handling

### Next.js Image Component

**Use Built-in**: `next/image`

**Benefits**:
- ✅ Automatic optimization
- ✅ Lazy loading
- ✅ Responsive images (srcset)
- ✅ WebP conversion
- ✅ Blur placeholder

**Example**:
```typescript
import Image from 'next/image';

<Image
  src="/products/prestige-cooker.jpg"
  alt="Prestige Pressure Cooker"
  width={500}
  height={500}
  priority={false}  // false for below-fold images
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

**For External Images** (S3):
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['s3.amazonaws.com', 'your-bucket.s3.region.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

---

## Icons

### Lucide React (Recommended)

**Why Lucide**:
- ✅ Clean, modern icons
- ✅ Tree-shakeable (only import used icons)
- ✅ Consistent design
- ✅ Works well with shadcn/ui

**Installation**:
```bash
npm install lucide-react
```

**Usage**:
```typescript
import { Heart, ShoppingCart, Search, Menu } from 'lucide-react';

<Heart className="w-5 h-5" />
```

**Alternative**: react-icons (more variety, larger bundle)

---

## Carousel/Slider

### Embla Carousel (Recommended)

**Why Embla**:
- ✅ Lightweight, dependency-free
- ✅ Touch/swipe support
- ✅ Responsive
- ✅ Accessible

**Installation**:
```bash
npm install embla-carousel-react
```

**Use Cases**:
- Homepage banner carousel
- Product image gallery
- Related products slider

**Alternative**: Swiper (more features, heavier)

---

## Authentication

### JWT (JSON Web Tokens)

**Storage Options**:

**Option 1: httpOnly Cookies** (Recommended for Security)
- ✅ Cannot be accessed by JavaScript (XSS protection)
- ✅ Automatically sent with requests
- ❌ Requires backend cookie handling

**Option 2: localStorage**
- ✅ Easy to implement
- ✅ Works with static hosting
- ❌ Vulnerable to XSS attacks
- **Mitigation**: Sanitize all user inputs, use CSP headers

**Recommendation**: httpOnly cookies if possible, localStorage with precautions

**Token Structure**:
```json
{
  "userId": "uuid",
  "phone": "+919876543210",
  "role": "USER",
  "exp": 1640995200
}
```

**Expiry**: 30 days (2592000 seconds)

---

## Mock API Implementation (Phase 1)

### Next.js API Routes

**Location**: `/pages/api/*` or `/app/api/*/route.ts`

**Example Mock Endpoint**:
```typescript
// pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import productsData from '@/mock_data/products.json';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { search, categoryId } = req.query;
    
    let products = productsData.products;
    
    // Simple filtering
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: products.length
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

**Mock Data Storage**: JSON files in `/mock_data` folder

---

# PERFORMANCE REQUIREMENTS

## Loading Time Targets

### Mobile (4G Connection)

**Homepage**:
- First Contentful Paint (FCP): < 1.5 seconds
- Largest Contentful Paint (LCP): < 2.5 seconds
- Time to Interactive (TTI): < 3.5 seconds

**Product Listing Pages**:
- FCP: < 1.5 seconds
- LCP: < 2.5 seconds

**Product Detail Pages**:
- FCP: < 1.8 seconds
- LCP: < 3.0 seconds

**Admin Pages** (Desktop, Broadband):
- FCP: < 1.0 second
- LCP: < 2.0 seconds

### Desktop (Broadband)

**All Pages**:
- FCP: < 0.8 seconds
- LCP: < 1.5 seconds
- TTI: < 2.0 seconds

---

## Lighthouse Score Targets

**User-Facing Pages**:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

**Admin Pages**:
- Performance: > 80 (acceptable due to complexity)
- Accessibility: > 85
- Best Practices: > 90

---

## Optimization Strategies

### 1. Code Splitting

**Automatic**: Next.js does this by default (route-based)

**Manual** (for heavy components):
```typescript
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('@/components/AdminDashboard'), {
  loading: () => <Spinner />,
  ssr: false  // Disable SSR for admin components
});
```

**Use For**:
- Admin panel components
- Heavy third-party libraries
- Components below the fold

---

### 2. Image Optimization

**Techniques**:
- Use `next/image` for all images
- Lazy load below-fold images (`priority={false}`)
- Serve WebP/AVIF formats
- Responsive images (multiple sizes)
- Blur placeholder for better UX

**Product Image Sizes**:
- Thumbnail (grid): 256x256px
- Detail page primary: 800x800px
- Detail page thumbnails: 100x100px
- Category images: 400x400px
- Banners: 1920x600px (desktop), 800x400px (mobile)

**Compression**: Use image optimization tools or CDN (Cloudinary, imgix)

---

### 3. Font Optimization

**Use Next.js Font Optimization**:
```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**Benefits**:
- Automatic font subsetting
- Self-hosted fonts (no external requests)
- Zero layout shift

---

### 4. Bundle Size Optimization

**Techniques**:
- Tree-shake unused code
- Import only needed components: `import { Button } from 'ui/button'`
- Analyze bundle: `npm run build` → Check .next/analyze
- Use dynamic imports for heavy libraries

**Target Bundle Sizes**:
- First Load JS: < 200KB (gzipped)
- Individual page JS: < 50KB (gzipped)

**Analyze Tool**:
```bash
npm install --save-dev @next/bundle-analyzer
```

---

### 5. API Response Optimization

**Strategies**:
- Pagination (max 24-50 items per page)
- Only return necessary fields
- Compress responses (gzip)
- Cache API responses (SWR handles this)

**Example**: Don't return full product details in list views, only:
- id, name, slug, brand name, price, primary image, rating

---

### 6. Lazy Loading

**Images**: Automatic with `next/image`

**Components**:
```typescript
// Lazy load modal content
const ProductDetailModal = dynamic(
  () => import('@/components/ProductDetailModal')
);
```

**Infinite Scroll** (Phase 2):
- Use Intersection Observer API
- Load more products as user scrolls

---

### 7. Caching Strategy

**Static Pages** (Next.js):
- Category pages: ISR (Incremental Static Regeneration) every 5 minutes
- Product pages: ISR every 1 minute
- Homepage: ISR every 5 minutes

**API Caching** (SWR):
```typescript
const { data } = useSWR('/api/categories', fetcher, {
  dedupingInterval: 60000,  // 1 minute
  revalidateOnFocus: false,
  revalidateOnReconnect: false
});
```

**Browser Caching**:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

---

# SECURITY REQUIREMENTS

## 1. Authentication Security

**JWT Token**:
- Use strong secret key (256-bit)
- Set expiration (30 days max)
- Include user role in payload
- Verify signature on every request

**Password/OTP**:
- Backend: Hash OTPs before storing
- Expire OTPs after 5 minutes
- Limit OTP requests (max 3 per phone per hour)

**Session Management**:
- Clear token on logout
- Auto-logout on token expiry
- Refresh token mechanism (Phase 2)

---

## 2. Input Validation & Sanitization

**All User Inputs**:
- Validate on client AND server
- Sanitize to prevent XSS
- Use libraries: DOMPurify for rich text

**Form Validation**:
```typescript
import { z } from 'zod';

const phoneSchema = z.string()
  .regex(/^\+91[0-9]{10}$/, 'Invalid phone number');

const productSchema = z.object({
  name: z.string().min(3).max(200),
  price: z.number().positive(),
  sku: z.string().regex(/^[A-Z0-9-]+$/),
});
```

---

## 3. XSS (Cross-Site Scripting) Prevention

**Techniques**:
- React escapes values by default ✓
- Never use `dangerouslySetInnerHTML` without sanitization
- Set Content Security Policy (CSP) headers
- Sanitize user-generated content (product descriptions)

**CSP Headers**:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
          }
        ]
      }
    ];
  }
};
```

---

## 4. CSRF (Cross-Site Request Forgery) Protection

**For State-Changing Requests**:
- Use CSRF tokens for forms
- Verify origin header
- Use SameSite cookies

**Next.js API Routes**:
```typescript
// Verify origin
const origin = req.headers.origin;
const allowedOrigins = ['https://newguruenterprises.com'];

if (!allowedOrigins.includes(origin)) {
  res.status(403).json({ error: 'Forbidden' });
}
```

---

## 5. File Upload Security

**Image Uploads**:
- Validate file type (whitelist: jpg, png, webp)
- Validate file size (max 5MB)
- Scan for malware (backend)
- Rename files (prevent path traversal)
- Store in isolated bucket (S3)

**Frontend Validation**:
```typescript
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB

if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}
if (file.size > maxSize) {
  throw new Error('File too large');
}
```

---

## 6. Rate Limiting

**OTP Requests**:
- Max 3 requests per phone per hour
- Max 10 requests per IP per hour

**API Endpoints**:
- Max 100 requests per minute per user (Phase 2)

**Implementation**: Backend responsibility, frontend shows user-friendly errors

---

## 7. Environment Variables

**Never Commit**:
- API keys
- JWT secrets
- Database credentials
- AWS credentials

**Use `.env.local`** (gitignored):
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=your-super-secret-key-here
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

**Public vs Private**:
- `NEXT_PUBLIC_*`: Exposed to browser (API URLs)
- No prefix: Server-only (secrets)

---

## 8. HTTPS Enforcement

**Production**:
- Always use HTTPS
- Redirect HTTP to HTTPS
- Set Secure flag on cookies
- Use HSTS header

---

# BROWSER SUPPORT

## Target Browsers

**Desktop**:
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions

**Mobile**:
- Chrome Android: Last 2 versions
- Safari iOS: Last 2 versions

**Not Supporting**:
- Internet Explorer (discontinued)

**Testing**: Use BrowserStack or manual testing on real devices

---

# DEVELOPMENT ENVIRONMENT

## Required Software

**Node.js**: v18+ (LTS recommended)
**Package Manager**: npm, yarn, or pnpm (agent's choice)
**Editor**: VS Code (recommended)

**VS Code Extensions** (Recommended):
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript (if using TS)

---

## Project Structure

```
online-store-frontend/
├── public/
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/                    # Next.js App Router (or pages/)
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Homepage
│   │   ├── products/
│   │   ├── categories/
│   │   ├── wishlist/
│   │   ├── login/
│   │   └── admin/
│   ├── components/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Header, Footer, etc.
│   │   ├── product/            # ProductTile, ProductCard
│   │   └── admin/              # Admin components
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Auth helpers
│   │   └── utils.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   └── useWishlist.ts
│   ├── context/                # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── types/                  # TypeScript types
│   │   ├── product.ts
│   │   ├── user.ts
│   │   └── api.ts
│   └── mock_data/              # Mock JSON files
│       ├── products.json
│       ├── categories.json
│       └── users.json
├── .env.local                  # Environment variables (gitignored)
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json               # If using TypeScript
├── package.json
└── README.md
```

---

## Environment Setup

**Step 1: Initialize Project**
```bash
npx create-next-app@latest online-store --typescript --tailwind --app
cd online-store
```

**Step 2: Install Dependencies**
```bash
npm install swr react-hook-form lucide-react
npm install embla-carousel-react
npx shadcn-ui@latest init
```

**Step 3: Install shadcn/ui Components**
```bash
npx shadcn-ui@latest add button input card badge
npx shadcn-ui@latest add dialog sheet dropdown-menu
npx shadcn-ui@latest add toast carousel
```

**Step 4: Setup Mock Data**
```bash
mkdir -p src/mock_data
# Create JSON files (categories.json, products.json, etc.)
```

**Step 5: Configure Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

---

## Development Workflow

**Start Dev Server**:
```bash
npm run dev
# Opens at http://localhost:3000
```

**Build for Production**:
```bash
npm run build
npm run start
```

**Linting**:
```bash
npm run lint
```

**Type Checking** (TypeScript):
```bash
npx tsc --noEmit
```

---

# DEPLOYMENT

## Hosting Platform

**Recommended**: Vercel (Made by Next.js creators)

**Why Vercel**:
- ✅ Zero-config Next.js deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions (API routes)
- ✅ Free tier for small projects
- ✅ Preview deployments (PRs)

**Alternative Platforms**:
- Netlify (similar to Vercel)
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted (VPS with Node.js)

---

## Deployment Configuration

### Vercel Deployment

**Step 1: Connect Repository**
- Link GitHub/GitLab repo to Vercel
- Auto-deploy on push to main branch

**Step 2: Environment Variables**
- Add in Vercel dashboard
- Separate for Production/Preview

**Step 3: Build Settings**
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

**Step 4: Domain Setup**
- Add custom domain (newguruenterprises.com)
- Automatic SSL certificate

---

## Production Checklist

**Before Going Live**:
- [ ] Environment variables configured
- [ ] Analytics setup (Google Analytics, Vercel Analytics)
- [ ] Error tracking (Sentry, LogRocket)
- [ ] Sitemap generated (`next-sitemap`)
- [ ] Robots.txt configured
- [ ] Favicon and meta tags set
- [ ] Social share images (Open Graph)
- [ ] Performance tested (Lighthouse)
- [ ] Mobile tested (real devices)
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] 404 page customized
- [ ] Loading states tested
- [ ] Error states tested

---

# MONITORING & ANALYTICS

## Performance Monitoring

**Vercel Analytics** (Built-in):
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Free tier available

**Alternative**: Google PageSpeed Insights, WebPageTest

---

## User Analytics

**Google Analytics 4**:
```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

**Track Events**:
- Product views
- Wishlist additions
- Search queries
- Button clicks

---

## Error Tracking

**Sentry** (Recommended):
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Captures**:
- JavaScript errors
- API errors
- Performance issues
- User sessions

---

# ACCESSIBILITY COMPLIANCE

## WCAG 2.1 Level AA

**Requirements**:
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigation: All interactive elements focusable
- Screen reader support: Proper ARIA labels
- Focus indicators: Visible on all interactive elements
- Form labels: Associated with inputs
- Alt text: All images have descriptive alt text

**Testing Tools**:
- axe DevTools (browser extension)
- Lighthouse accessibility audit
- NVDA/JAWS screen readers

---

# PHASE 2 CONSIDERATIONS

**Technologies to Add Later**:
- Payment gateway integration (Razorpay, Stripe)
- Email service (SendGrid, Mailgun)
- Push notifications (OneSignal, Firebase)
- Advanced analytics (Mixpanel, Amplitude)
- A/B testing (Optimizely, Google Optimize)
- Search engine (Algolia, Elasticsearch)
- Real-time features (WebSockets, Pusher)

**Database** (when moving from mock APIs):
- PostgreSQL (recommended, matches backend)
- Backend handles all DB operations
- Frontend only calls APIs

---

**End of Technical Constraints** - Use this document for all technical decisions and setup requirements.
