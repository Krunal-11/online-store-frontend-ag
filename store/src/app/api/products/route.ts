import { NextRequest } from 'next/server';
import {
  delay,
  successResponse,
  getQueryParams,
  getPaginationParams,
  paginate,
  getPlaceholderImage,
} from '@/lib/mock-helpers';
import productsData from '@/mock_data/products.json';
import brandsData from '@/mock_data/brands.json';
import categoriesData from '@/mock_data/categories.json';
import type { ProductListItem, Category } from '@/types';

interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId: string;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  status: string;
}

interface ProductVariant {
  id: string;
  productGroupId: string;
  sku: string;
  slug: string;
  name: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  status: string;
  isDefaultVariant: boolean;
  attributes: Record<string, string>;
}

interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

// Flatten categories to search by ID
const flattenCategories = (categories: Category[]): Category[] => {
  const result: Category[] = [];
  const flatten = (cats: Category[]) => {
    for (const cat of cats) {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children);
      }
    }
  };
  flatten(categories);
  return result;
};

// Get all category IDs including children (for filtering by parent category)
const getCategoryIdsWithChildren = (categoryId: string): string[] => {
  const allCategories = flattenCategories(categoriesData as Category[]);
  const ids: string[] = [categoryId];
  
  const addChildren = (parentId: string) => {
    const children = allCategories.filter((c) => c.parentId === parentId);
    for (const child of children) {
      ids.push(child.id);
      addChildren(child.id);
    }
  };
  
  addChildren(categoryId);
  return ids;
};

// Transform raw data to ProductListItem format
const transformToProductListItems = (): ProductListItem[] => {
  const { productGroups, products, productImages } = productsData as unknown as {
    productGroups: ProductGroup[];
    products: ProductVariant[];
    productImages: ProductImage[];
  };
  const allCategories = flattenCategories(categoriesData as Category[]);

  const items: ProductListItem[] = [];

  for (const group of productGroups) {
    // Get default variant or first variant
    const variants = products.filter((p) => p.productGroupId === group.id);
    const defaultVariant = variants.find((v) => v.isDefaultVariant) || variants[0];
    
    if (!defaultVariant) continue;

    // Get brand name
    const brand = brandsData.find((b) => b.id === group.brandId);
    
    // Get primary image
    const image = productImages.find(
      (img) => img.productId === defaultVariant.id && img.isPrimary
    );

    // Get category
    const category = allCategories.find((c) => c.id === group.categoryId);

    items.push({
      id: defaultVariant.id,
      productGroupId: group.id,
      name: group.name,
      slug: group.slug,
      variantSlug: defaultVariant.slug,
      variantName: defaultVariant.name,
      brandName: brand?.name || 'Unknown Brand',
      categoryId: group.categoryId,
      categoryName: category?.name || 'Uncategorized',
      mrp: defaultVariant.mrp,
      sellingPrice: defaultVariant.sellingPrice,
      discountPercentage: defaultVariant.discountPercentage,
      averageRating: group.averageRating,
      totalReviews: group.totalReviews,
      primaryImage: getPlaceholderImage(group.name, 400, 400),
      isFeatured: group.isFeatured,
      variantCount: variants.length,
    });
  }

  return items;
};

// Sort function for products
type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'discount' | 'newest';

const sortProducts = (items: ProductListItem[], sortBy: SortOption): ProductListItem[] => {
  const sorted = [...items];
  
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
    case 'price_desc':
      return sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);
    case 'rating':
      return sorted.sort((a, b) => b.averageRating - a.averageRating);
    case 'discount':
      return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
    case 'newest':
      // For mock data, reverse the array (newer items last in JSON)
      return sorted.reverse();
    case 'relevance':
    default:
      // Featured first, then by rating
      return sorted.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.averageRating - a.averageRating;
      });
  }
};

export async function GET(request: NextRequest) {
  await delay(200);

  const searchParams = getQueryParams(request);
  const { page, limit } = getPaginationParams(searchParams);
  
  // Get filter params
  const search = searchParams.get('search')?.toLowerCase();
  const categoryId = searchParams.get('categoryId');
  const brandId = searchParams.get('brandId');
  const featured = searchParams.get('featured');
  const sort = (searchParams.get('sort') || 'relevance') as SortOption;

  // Get all products as list items
  let items = transformToProductListItems();

  // Apply filters
  if (search) {
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.brandName.toLowerCase().includes(search) ||
        item.categoryName?.toLowerCase().includes(search)
    );
  }

  if (categoryId) {
    // Include products from child categories too
    const categoryIds = getCategoryIdsWithChildren(categoryId);
    items = items.filter((item) => categoryIds.includes(item.categoryId || ''));
  }

  if (brandId) {
    const brand = brandsData.find((b) => b.id === brandId || b.slug === brandId);
    if (brand) {
      const { productGroups } = productsData as { productGroups: ProductGroup[] };
      const brandGroupIds = productGroups
        .filter((g) => g.brandId === brand.id)
        .map((g) => g.id);
      items = items.filter((item) => brandGroupIds.includes(item.productGroupId));
    }
  }

  if (featured === 'true') {
    items = items.filter((item) => item.isFeatured);
  }

  // Apply sorting
  items = sortProducts(items, sort);

  // Paginate results
  const result = paginate(items, page, limit);

  return successResponse(result);
}
