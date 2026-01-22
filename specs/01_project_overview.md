High-level business context and project goals - read this first to understand what we're building and why.

**Last Updated**: 2026-01-22 (Updated to reflect Phase 1 implementation through Step 9)

---

# PROJECT OVERVIEW

## Business Context

**Company**: New Guru Enterprises  
**Location**: No. 5-4-726/1, Nampally Station Road ABIDS SOUTH Hyderabad, Telangana, 500001 India  
**Contact**: 9849067667  
**Business**: Home appliances and kitchenware retail store

## What We're Building

A **catalog-first online store** application that showcases the wide variety of products available at New Guru Enterprises. This is NOT a traditional e-commerce platform focused on online sales - it's designed to help customers browse products online and connect with the store.

### Primary Goals

1. **Product Discovery**: Allow customers to explore the full catalog of home appliances and kitchenware
2. **Wishlist Management**: Enable users to save products they're interested in
3. **Store Connection**: Make it easy for customers to contact the store or visit in person
4. **Admin Efficiency**: Provide easy tools for store admin to manage products, categories, and promotional content

### Key Business Message

"Wide Range of home appliances and kitchenware - Home delivery available"

## Target Audience

### Primary Users (Customers)
- **Device**: Primarily mobile users (mobile-first design)
- **Behavior**: Browsing products, comparing prices, saving items for later
- **Goal**: Find products they need and contact/visit store to purchase
- **Tech Savvy**: Moderate - simple, intuitive interface required

### Secondary Users (Admin)
- **Device**: Primarily desktop users (desktop-first for admin panel)
- **Role**: Store owner/manager managing product catalog
- **Goal**: Efficiently update products, prices, categories, and promotions
- **Tech Savvy**: Moderate - need easy-to-use interface without technical complexity

## Project Scope

### What This Is
- Product catalog and showcase platform
- Wishlist and browsing application
- Admin product management system
- Mobile-optimized customer experience

### What This Is NOT (at least not initially)
- Full e-commerce platform with shopping cart
- Payment processing system
- Inventory management system
- Order fulfillment platform

*(Note: Cart and ordering may be added in Phase 2, but not the current priority)*

## Development Philosophy

### Phase 1: Core Catalog Experience
Build a solid foundation with essential features:
- Homepage with categories and banners
- Product browsing and search
- Wishlist functionality
- User authentication
- Complete admin panel for content management

### Phase 2: Enhanced Features
Add advanced capabilities after Phase 1 is stable:
- Shopping cart and checkout
- Advanced search and filters
- Ratings and reviews
- Analytics and insights
- Inventory management

### Technical Principles
1. **Simplicity First**: Choose simpler solutions unless complexity is justified
2. **Performance Matters**: Fast loading, especially on mobile
3. **User Experience**: Clean, minimal, intuitive design
4. **Scalability**: Build Phase 1 to easily accommodate Phase 2 features
5. **Mobile-First**: Optimize for mobile users (customer-facing), desktop for admin

## Success Metrics

### Phase 1 Success Indicators
- Customers can browse entire catalog within 3 clicks from homepage
- Product pages load in under 2 seconds on mobile
- Admin can add/update products without technical support
- Mobile users can easily navigate and wishlist products
- Clean, professional UI that builds trust in the brand

### Future Metrics (Phase 2)
- Conversion from wishlist to store visit/contact
- Search effectiveness
- User engagement (repeat visits, time on site)
- Admin efficiency (time to update catalog)

## Technical Context

### Frontend (Implemented)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with CSS-first configuration
- **UI Components**: shadcn/ui
- **State Management**: React Context API (auth) + SWR (server state)
- **Target**: Modern web browsers (last 2 versions)
- **Responsive**: Mobile-first for users, desktop-first for admin (Phase 2)

### Design System (Implemented)
- **Primary Color**: Deep Teal (#0F766E) - trust, professionalism
- **Accent Color**: Warm Amber (#F59E0B) - CTAs, discounts
- **Typography**: System font stack (zero load time)
- **Theme**: Light mode only (Phase 1)

### Backend (Reference)
- **Database**: PostgreSQL with hierarchical category structure
- **Authentication**: Phone-based OTP verification (mock in Phase 1)
- **Storage**: AWS S3 for product images (placeholder URLs in Phase 1)

### Integration Approach
- **Phase 1**: Mock APIs using Next.js API routes with JSON files
- **Phase 2**: Connect to actual Spring Boot backend APIs

---

## Phase 1 Implementation Progress

### Completed Steps (1-9)
1. ✅ Project Setup and Configuration
2. ✅ Design System and Theme Setup
3. ✅ Layout Components (Header, Footer, Mobile Navigation)
4. ✅ Mock Data and API Routes
5. ✅ Homepage Implementation
6. ✅ Category Navigation and Pages
7. ✅ Product Grid Component
8. ✅ Product Detail Page
9. ✅ Authentication System (Phone OTP Mock)

### Remaining Steps (10-21)
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

**Next Steps**: Read `02_features_detailed.md` for complete feature specifications organized by Phase 1 (priority) and Phase 2 (future).
