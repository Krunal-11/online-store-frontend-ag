import { NextRequest } from 'next/server';
import {
  delay,
  successResponse,
  errorResponse,
  getTokenFromHeader,
  verifyToken,
} from '@/lib/mock-helpers';

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

  // Mock: Just return success (frontend will clear token)
  return successResponse({
    message: 'Logged out successfully',
  });
}
