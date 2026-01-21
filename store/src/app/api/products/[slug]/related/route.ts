import { NextRequest } from 'next/server';
import {
  delay,
  successResponse,
  errorResponse,
  getPlaceholderImage,
} from '@/lib/mock-helpers';
import productsData from '@/mock_data/products.json';
import brandsData from '@/mock_data/brands.json';
import categoriesData from '@/mock_data/categories.json';
import type { Category, ProductListItem } from '@/types';

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

// Flatten categories
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await delay(200);

  const { slug } = await params;
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10);

  const { productGroups, products, productImages } = productsData as unknown as {
    productGroups: ProductGroup[];
    products: ProductVariant[];
    productImages: ProductImage[];
  };

  // Find current product group
  const currentProductGroup = productGroups.find(
    (pg) => pg.slug === slug || pg.id === slug
  );

  if (!currentProductGroup) {
    return errorResponse('PRODUCT_NOT_FOUND', 'Product not found', 404);
  }

  const allCategories = flattenCategories(categoriesData as Category[]);

  // Find related products: same category first, then same brand
  const relatedGroups: ProductGroup[] = [];

  // First priority: Same category (excluding current product)
  const sameCategoryGroups = productGroups.filter(
    (pg) =>
      pg.categoryId === currentProductGroup.categoryId &&
      pg.id !== currentProductGroup.id &&
      pg.status === 'ACTIVE'
  );
  relatedGroups.push(...sameCategoryGroups);

  // If not enough, add same brand products
  if (relatedGroups.length < limit) {
    const sameBrandGroups = productGroups.filter(
      (pg) =>
        pg.brandId === currentProductGroup.brandId &&
        pg.id !== currentProductGroup.id &&
        pg.status === 'ACTIVE' &&
        !relatedGroups.find((rg) => rg.id === pg.id)
    );
    relatedGroups.push(...sameBrandGroups);
  }

  // If still not enough, add featured products
  if (relatedGroups.length < limit) {
    const featuredGroups = productGroups.filter(
      (pg) =>
        pg.isFeatured &&
        pg.id !== currentProductGroup.id &&
        pg.status === 'ACTIVE' &&
        !relatedGroups.find((rg) => rg.id === pg.id)
    );
    relatedGroups.push(...featuredGroups);
  }

  // Transform to ProductListItem format
  const relatedProducts: ProductListItem[] = relatedGroups
    .slice(0, limit)
    .map((group) => {
      const variants = products.filter((p) => p.productGroupId === group.id);
      const defaultVariant = variants.find((v) => v.isDefaultVariant) || variants[0];
      const brand = brandsData.find((b) => b.id === group.brandId);
      const category = allCategories.find((c) => c.id === group.categoryId);

      return {
        id: defaultVariant?.id || group.id,
        productGroupId: group.id,
        name: group.name,
        slug: group.slug,
        variantSlug: defaultVariant?.slug || '',
        variantName: defaultVariant?.name || '',
        brandName: brand?.name || 'Unknown Brand',
        categoryId: group.categoryId,
        categoryName: category?.name || 'Uncategorized',
        mrp: defaultVariant?.mrp || 0,
        sellingPrice: defaultVariant?.sellingPrice || 0,
        discountPercentage: defaultVariant?.discountPercentage || 0,
        averageRating: group.averageRating,
        totalReviews: group.totalReviews,
        primaryImage: getPlaceholderImage(group.name, 400, 400),
        isFeatured: group.isFeatured,
        variantCount: variants.length,
      };
    });

  return successResponse({ data: relatedProducts });
}
