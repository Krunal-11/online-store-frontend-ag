import { NextRequest } from 'next/server';
import { delay, successResponse, errorResponse, getPlaceholderImage } from '@/lib/mock-helpers';
import categoriesData from '@/mock_data/categories.json';
import type { Category } from '@/types';

// Flatten categories for easier search
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

// Find category by slug or id
const findCategory = (slugOrId: string): Category | undefined => {
  const allCategories = flattenCategories(categoriesData as Category[]);
  return allCategories.find(
    (cat) => cat.slug === slugOrId || cat.id === slugOrId
  );
};

// Get direct children of a category
const getChildren = (parentId: string): Category[] => {
  const allCategories = flattenCategories(categoriesData as Category[]);
  return allCategories.filter((cat) => cat.parentId === parentId);
};

// Build breadcrumb for a category
const buildBreadcrumb = (category: Category): { name: string; slug: string }[] => {
  const breadcrumb: { name: string; slug: string }[] = [{ name: 'Home', slug: '/' }];
  
  if (category.path) {
    const pathParts = category.path.split('/').filter(Boolean);
    let currentPath = '';
    
    for (const part of pathParts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const cat = flattenCategories(categoriesData as Category[]).find(
        (c) => c.path === currentPath
      );
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
  const category = findCategory(slug);

  if (!category) {
    return errorResponse('NOT_FOUND', 'Category not found', 404);
  }

  // Get subcategories (direct children)
  const subcategories = getChildren(category.id).map((cat) => ({
    ...cat,
    imageUrl: getPlaceholderImage(cat.name, 300, 200),
  }));

  // Build breadcrumb
  const breadcrumb = buildBreadcrumb(category);

  return successResponse({
    data: {
      ...category,
      imageUrl: getPlaceholderImage(category.name, 300, 200),
    },
    subcategories,
    breadcrumb,
  });
}
