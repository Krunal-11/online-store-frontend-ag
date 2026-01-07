import { delay, successResponse, getPlaceholderImage } from '@/lib/mock-helpers';
import brandsData from '@/mock_data/brands.json';

export async function GET() {
  await delay(200);

  // Transform brands with placeholder images
  const brands = brandsData.map((brand) => ({
    ...brand,
    logoUrl: getPlaceholderImage(brand.name, 150, 100),
  }));

  return successResponse({
    data: brands,
  });
}
