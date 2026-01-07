/**
 * Mock API Helpers
 * Utility functions for mock API routes
 */

// Artificial delay to simulate network latency
export const delay = (ms: number = 200): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Generate a simple mock token (base64 encoded)
export const generateToken = (userId: string): string => {
  const payload = {
    userId,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

// Verify and decode mock token
export const verifyToken = (token: string): { userId: string; exp: number } | null => {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded.exp < Date.now()) {
      return null; // Token expired
    }
    return decoded;
  } catch {
    return null;
  }
};

// Extract token from Authorization header
export const getTokenFromHeader = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
};

// Generate placeholder image URL
export const getPlaceholderImage = (
  text: string,
  width: number = 400,
  height: number = 400
): string => {
  const encodedText = encodeURIComponent(text.slice(0, 20));
  return `https://placehold.co/${width}x${height}/e2e8f0/475569?text=${encodedText}`;
};

// Standard API response helpers
export const successResponse = <T>(data: T, status: number = 200): Response => {
  return Response.json({ success: true, ...data }, { status });
};

export const errorResponse = (
  error: string,
  message: string,
  status: number = 400
): Response => {
  return Response.json({ success: false, error, message }, { status });
};

// Pagination helper
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
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

export const paginate = <T>(
  items: T[],
  page: number = 1,
  limit: number = 24
): PaginationResult<T> => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const data = items.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};

// Parse query params helper
export const getQueryParams = (request: Request): URLSearchParams => {
  const url = new URL(request.url);
  return url.searchParams;
};

// Get pagination params from query string
export const getPaginationParams = (searchParams: URLSearchParams): PaginationParams => {
  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: Math.min(parseInt(searchParams.get('limit') || '24', 10), 100),
  };
};
