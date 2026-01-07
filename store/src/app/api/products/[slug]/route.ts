import { NextRequest } from 'next/server';
import { delay, successResponse, errorResponse, getPlaceholderImage } from '@/lib/mock-helpers';
import productsData from '@/mock_data/products.json';
import brandsData from '@/mock_data/brands.json';
import categoriesData from '@/mock_data/categories.json';
import type { Category } from '@/types';

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

// Build breadcrumb for a category
const buildBreadcrumb = (categoryId: string): { name: string; slug: string }[] => {
  const allCategories = flattenCategories(categoriesData as Category[]);
  const category = allCategories.find((c) => c.id === categoryId);
  
  if (!category) {
    return [{ name: 'Home', slug: '/' }];
  }

  const breadcrumb: { name: string; slug: string }[] = [{ name: 'Home', slug: '/' }];
  
  if (category.path) {
    const pathParts = category.path.split('/').filter(Boolean);
    let currentPath = '';
    
    for (const part of pathParts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const cat = allCategories.find((c) => c.path === currentPath);
      if (cat) {
        breadcrumb.push({ name: cat.name, slug: cat.slug });
      }
    }
  }
  
  return breadcrumb;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await delay(200);

  const { slug } = await params;
  const { productGroups, products, productImages } = productsData as unknown as {
    productGroups: ProductGroup[];
    products: ProductVariant[];
    productImages: ProductImage[];
  };

  // Find product group by slug or id
  const productGroup = productGroups.find(
    (pg) => pg.slug === slug || pg.id === slug
  );

  if (!productGroup) {
    return errorResponse('PRODUCT_NOT_FOUND', 'Product not found', 404);
  }

  // Get brand
  const brand = brandsData.find((b) => b.id === productGroup.brandId);

  // Get category
  const allCategories = flattenCategories(categoriesData as Category[]);
  const category = allCategories.find((c) => c.id === productGroup.categoryId);

  // Get all variants for this product group
  const variants = products
    .filter((p) => p.productGroupId === productGroup.id)
    .map((variant) => {
      // Get images for this variant
      const images = productImages
        .filter((img) => img.productId === variant.id)
        .map((img) => ({
          ...img,
          url: getPlaceholderImage(`${productGroup.name} ${variant.name}`, 600, 600),
        }));

      return {
        ...variant,
        images: images.length > 0 ? images : [
          {
            id: `placeholder-${variant.id}`,
            productId: variant.id,
            url: getPlaceholderImage(`${productGroup.name} ${variant.name}`, 600, 600),
            altText: `${productGroup.name} ${variant.name}`,
            displayOrder: 1,
            isPrimary: true,
          },
        ],
      };
    });

  // Build response
  const response = {
    id: productGroup.id,
    name: productGroup.name,
    slug: productGroup.slug,
    description: productGroup.description,
    brand: brand
      ? {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          logoUrl: getPlaceholderImage(brand.name, 100, 100),
        }
      : null,
    category: category
      ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          path: category.path,
          breadcrumb: buildBreadcrumb(category.id),
        }
      : null,
    variants,
    averageRating: productGroup.averageRating,
    totalReviews: productGroup.totalReviews,
    isFeatured: productGroup.isFeatured,
    status: productGroup.status,
  };

  return successResponse({ data: response });
}
