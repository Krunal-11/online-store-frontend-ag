import { NextRequest } from 'next/server';
import { delay, successResponse, errorResponse, verifyToken } from '@/lib/mock-helpers';

// In-memory user storage for profile updates (mock)
// In real app, this would update the database
const userProfiles: Record<string, { name?: string; email?: string; address?: string }> = {};

export async function PUT(request: NextRequest) {
  await delay(200);

  try {
    // Check for auth token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return errorResponse(
        'UNAUTHORIZED',
        'Authentication required',
        401
      );
    }

    // Verify token
    const tokenData = verifyToken(token);
    if (!tokenData) {
      return errorResponse(
        'INVALID_TOKEN',
        'Invalid or expired token',
        401
      );
    }

    const userId = tokenData.userId;
    const body = await request.json();
    const { name, email, address } = body;

    // Validate at least one field is provided
    if (!name && !email && !address) {
      return errorResponse(
        'INVALID_REQUEST',
        'Please provide at least one field to update',
        400
      );
    }

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return errorResponse(
          'INVALID_NAME',
          'Name must be at least 2 characters',
          400
        );
      }
    }

    // Validate email if provided
    if (email !== undefined && email !== null) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return errorResponse(
          'INVALID_EMAIL',
          'Please provide a valid email address',
          400
        );
      }
    }

    // Update user profile (mock - in memory)
    const existingProfile = userProfiles[userId] || {};
    const updatedProfile = {
      ...existingProfile,
      ...(name !== undefined && { name: name.trim() }),
      ...(email !== undefined && { email }),
      ...(address !== undefined && { address }),
    };
    userProfiles[userId] = updatedProfile;

    // Return updated user (mock response)
    return successResponse({
      message: 'Profile updated successfully',
      user: {
        id: userId,
        name: updatedProfile.name || null,
        email: updatedProfile.email || null,
        address: updatedProfile.address || null,
        role: 'USER', // Default role
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return errorResponse(
      'UPDATE_FAILED',
      'Failed to update profile. Please try again',
      500
    );
  }
}

export async function GET(request: NextRequest) {
  await delay(200);

  try {
    // Check for auth token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return errorResponse(
        'UNAUTHORIZED',
        'Authentication required',
        401
      );
    }

    // Verify token
    const tokenData = verifyToken(token);
    if (!tokenData) {
      return errorResponse(
        'INVALID_TOKEN',
        'Invalid or expired token',
        401
      );
    }

    const userId = tokenData.userId;

    // Get user profile (mock)
    const profile = userProfiles[userId] || {};

    return successResponse({
      user: {
        id: userId,
        name: profile.name || null,
        email: profile.email || null,
        address: profile.address || null,
        role: 'USER',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return errorResponse(
      'FETCH_FAILED',
      'Failed to fetch profile',
      500
    );
  }
}
