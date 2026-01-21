// Product Types
export interface Product {
  id: string;
  productGroupId: string;
  sku: string;
  name: string;
  slug: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  isDefaultVariant: boolean;
  attributes: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId: string;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductWithDetails extends Product {
  productGroup: ProductGroup;
  brand: Brand;
  category: Category;
  images: ProductImage[];
}

// Product Variant for detail page
export interface ProductVariant {
  id: string;
  slug: string;
  name: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  stockQuantity: number;
  isDefaultVariant: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  attributes: Record<string, string | number | boolean>;
  images: ProductImage[];
}

// Complete product detail for product page
export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    path: string;
    breadcrumb: { name: string; slug: string }[];
  };
  variants: ProductVariant[];
  images: ProductImage[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}

export interface ProductListItem {
  id: string;
  productGroupId: string;
  name: string;
  slug: string;
  variantSlug?: string;
  variantName?: string;
  brandName: string;
  categoryId?: string;
  categoryName?: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  averageRating: number;
  totalReviews: number;
  primaryImage: string;
  isFeatured?: boolean;
  variantCount?: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId: string | null;
  level: number;
  path: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  productCount?: number;
  children?: Category[];
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  productCount?: number;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  imageUrlDesktop: string;
  imageUrlMobile: string;
  linkType: 'CATEGORY' | 'BRAND' | 'PRODUCT' | 'COLLECTION' | 'EXTERNAL';
  linkValue: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  startDate?: string;
  endDate?: string;
}

// User Types
export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  address?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  userId: string;
  productGroupId: string;
  variantId: string;
  addedAt: string;
  product: ProductListItem;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  isNewUser: boolean;
}
