import { delay, successResponse, getPlaceholderImage } from '@/lib/mock-helpers';
import categoriesData from '@/mock_data/categories.json';
import type { Category } from '@/types';

// Add placeholder images to categories recursively
const addPlaceholderImages = (categories: Category[]): Category[] => {
  return categories.map((category) => ({
    ...category,
    imageUrl: getPlaceholderImage(category.name, 300, 200),
    children: category.children ? addPlaceholderImages(category.children) : undefined,
  }));
};

export async function GET() {
  await delay(200);

  // Transform categories with placeholder images
  const categories = addPlaceholderImages(categoriesData as Category[]);

  return successResponse({
    data: categories,
  });
}
