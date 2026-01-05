High-level business context and project goals - read this first to understand what we're building and why.

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

### Frontend
- **Framework**: Next.js (React)
- **Target**: Modern web browsers (last 2 versions)
- **Responsive**: Mobile-first for users, desktop-first for admin

### Backend (Reference)
- **Database**: PostgreSQL with hierarchical category structure
- **Authentication**: Phone-based OTP verification
- **Storage**: AWS S3 for product images

### Integration Approach
- **Phase 1**: Mock APIs using JSON files
- **Phase 2**: Connect to actual backend APIs

---

**Next Steps**: Read `02_features_detailed.md` for complete feature specifications organized by Phase 1 (priority) and Phase 2 (future).
