import { NextRequest } from 'next/server';
import {
  delay,
  successResponse,
  errorResponse,
  getTokenFromHeader,
  verifyToken,
  getPlaceholderImage,
} from '@/lib/mock-helpers';
import productsData from '@/mock_data/products.json';
import brandsData from '@/mock_data/brands.json';

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
  stockQuantity?: number;
  status: string;
  isDefaultVariant: boolean;
  attributes: Record<string, string>;
}

// In-memory wishlist storage (resets on server restart)
// In a real app, this would be stored in a database
const wishlistStore: Map<string, WishlistItem[]> = new Map();

interface WishlistItem {
  id: string;
  userId: string;
  productGroupId: string;
  variantId: string;
  addedAt: string;
}

// GET - Get user's wishlist
export async function GET(request: NextRequest) {
  await delay(200);

  const token = getTokenFromHeader(request);
  if (!token) {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return errorResponse('UNAUTHORIZED', 'Invalid or expired token', 401);
  }

  const userId = decoded.userId;
  const wishlist = wishlistStore.get(userId) || [];

  // Enrich wishlist items with product details
  const { productGroups, products } = productsData as unknown as {
    productGroups: ProductGroup[];
    products: ProductVariant[];
  };

  const enrichedWishlist = wishlist.map((item) => {
    const productGroup = productGroups.find((pg) => pg.id === item.productGroupId);
    const variant = products.find((p) => p.id === item.variantId);
    const brand = brandsData.find((b) => b.id === productGroup?.brandId);

    // Check if product or variant is unavailable (INACTIVE or ARCHIVED status)
    const isProductUnavailable = !productGroup || productGroup.status !== 'ACTIVE';
    const isVariantUnavailable = !variant || variant.status !== 'ACTIVE';
    const isUnavailable = isProductUnavailable || isVariantUnavailable;

    return {
      ...item,
      product: productGroup
        ? {
            id: item.variantId,
            productGroupId: item.productGroupId,
            name: productGroup.name,
            slug: productGroup.slug,
            variantSlug: variant?.slug || '',
            variantName: variant?.name || '',
            brandName: brand?.name || 'Unknown Brand',
            mrp: variant?.mrp || 0,
            sellingPrice: variant?.sellingPrice || 0,
            discountPercentage: variant?.discountPercentage || 0,
            averageRating: productGroup.averageRating,
            totalReviews: productGroup.totalReviews,
            primaryImage: getPlaceholderImage(productGroup.name, 400, 400),
            status: isUnavailable ? 'INACTIVE' : 'ACTIVE',
            stockQuantity: variant?.stockQuantity ?? 0,
          }
        : null,
    };
  });

  return successResponse({
    data: enrichedWishlist,
    totalItems: enrichedWishlist.length,
  });
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  await delay(200);

  const token = getTokenFromHeader(request);
  if (!token) {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return errorResponse('UNAUTHORIZED', 'Invalid or expired token', 401);
  }

  try {
    const body = await request.json();
    const { productGroupId, variantId } = body;

    if (!productGroupId || !variantId) {
      return errorResponse(
        'VALIDATION_ERROR',
        'productGroupId and variantId are required',
        400
      );
    }

    // Verify product exists
    const { productGroups, products } = productsData as unknown as {
      productGroups: ProductGroup[];
      products: ProductVariant[];
    };

    const productGroup = productGroups.find((pg) => pg.id === productGroupId);
    const variant = products.find((p) => p.id === variantId);

    if (!productGroup || !variant) {
      return errorResponse('PRODUCT_NOT_FOUND', 'Product or variant not found', 404);
    }

    const userId = decoded.userId;
    const userWishlist = wishlistStore.get(userId) || [];

    // Check if already in wishlist
    const existingItem = userWishlist.find(
      (item) => item.productGroupId === productGroupId && item.variantId === variantId
    );

    if (existingItem) {
      return errorResponse(
        'ALREADY_IN_WISHLIST',
        'This product is already in your wishlist',
        409
      );
    }

    // Add to wishlist
    const newItem: WishlistItem = {
      id: `wishlist-${Date.now()}`,
      userId,
      productGroupId,
      variantId,
      addedAt: new Date().toISOString(),
    };

    userWishlist.push(newItem);
    wishlistStore.set(userId, userWishlist);

    return successResponse(
      {
        message: 'Product added to wishlist',
        wishlistItem: newItem,
      },
      201
    );
  } catch {
    return errorResponse('INVALID_REQUEST', 'Invalid request body', 400);
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  await delay(200);

  const token = getTokenFromHeader(request);
  if (!token) {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return errorResponse('UNAUTHORIZED', 'Invalid or expired token', 401);
  }

  try {
    const body = await request.json();
    const { itemId, productGroupId, variantId } = body;

    const userId = decoded.userId;
    const userWishlist = wishlistStore.get(userId) || [];

    // Find item to remove (by itemId or by productGroupId+variantId)
    const itemIndex = userWishlist.findIndex((item) => {
      if (itemId) {
        return item.id === itemId;
      }
      return item.productGroupId === productGroupId && item.variantId === variantId;
    });

    if (itemIndex === -1) {
      return errorResponse('NOT_FOUND', 'Item not found in wishlist', 404);
    }

    // Remove item
    userWishlist.splice(itemIndex, 1);
    wishlistStore.set(userId, userWishlist);

    return successResponse({
      message: 'Product removed from wishlist',
    });
  } catch {
    return errorResponse('INVALID_REQUEST', 'Invalid request body', 400);
  }
}
