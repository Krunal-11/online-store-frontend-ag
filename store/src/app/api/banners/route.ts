import { delay, successResponse, getPlaceholderImage } from '@/lib/mock-helpers';
import bannersData from '@/mock_data/banners.json';

export async function GET() {
  await delay(200);

  // Transform banners with placeholder images, only return active ones
  const banners = bannersData
    .filter((banner) => banner.status === 'ACTIVE')
    .map((banner) => ({
      ...banner,
      imageUrlDesktop: getPlaceholderImage(banner.title, 1200, 400),
      imageUrlMobile: getPlaceholderImage(banner.title, 600, 400),
    }));

  return successResponse({
    data: banners,
  });
}
