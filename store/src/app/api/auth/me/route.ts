import { NextRequest } from 'next/server';
import {
  delay,
  successResponse,
  errorResponse,
  getTokenFromHeader,
  verifyToken,
} from '@/lib/mock-helpers';

// Fixed mock user (same as verify-otp)
const MOCK_USER = {
  id: 'user-1',
  phone: '+919876543210',
  name: 'Test User',
  email: 'testuser@example.com',
  address: '123, Test Street, Hyderabad',
  role: 'USER' as const,
  isVerified: true,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: new Date().toISOString(),
};

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

  // Return mock user
  return successResponse({
    user: MOCK_USER,
  });
}
