import { HeroBanner, CategoryGrid, FeaturedProducts, StoreInfo } from '@/components/home';

export default function Home() {
  return (
    <div className="container-main py-4 md:py-8">
      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Store Info */}
      <StoreInfo />
    </div>
  );
}
