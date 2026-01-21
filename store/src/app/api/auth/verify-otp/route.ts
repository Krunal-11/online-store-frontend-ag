import { NextRequest } from 'next/server';
import { delay, successResponse, errorResponse, generateToken } from '@/lib/mock-helpers';

// Admin phone numbers (store owner)
const ADMIN_PHONES = ['+919849067667'];

// Known users database (mock)
// In a real app, this would be a database lookup
const KNOWN_USERS: Record<string, {
  id: string;
  name: string | null;
  email: string | null;
  address: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}> = {
  '+919849067667': {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@newguruenterprises.com',
    address: 'No. 5-4-726/1, Nampally Station Road ABIDS SOUTH Hyderabad',
    role: 'ADMIN',
    createdAt: '2024-01-01T10:00:00Z',
  },
  '+919876543210': {
    id: 'user-1',
    name: 'Test User',
    email: 'testuser@example.com',
    address: '123, Test Street, Hyderabad',
    role: 'USER',
    createdAt: '2024-01-15T10:00:00Z',
  },
};

// Track "new" users for demo (in real app, this would be DB state)
const newUserPhones = new Set<string>();

export async function POST(request: NextRequest) {
  await delay(200);

  try {
    const body = await request.json();
    const { phone, otp } = body;

    // Validate phone number (supports international formats)
    if (!phone || !/^\+[0-9]{10,15}$/.test(phone)) {
      return errorResponse(
        'INVALID_PHONE',
        'Please provide a valid phone number',
        400
      );
    }

    // Validate OTP format (6 digits)
    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      return errorResponse(
        'INVALID_OTP',
        'Invalid OTP. Please enter a 6-digit code',
        400
      );
    }

    // Mock: Accept any 6-digit OTP for testing

    // Check if this is a known user
    const knownUser = KNOWN_USERS[phone];
    
    // Determine if this is a new user
    let isNewUser = false;
    let user: {
      id: string;
      phone: string;
      name: string | null;
      email: string | null;
      address: string | null;
      role: 'USER' | 'ADMIN';
      createdAt: string;
      updatedAt: string;
    };

    if (knownUser) {
      // Existing user
      user = {
        ...knownUser,
        phone,
        updatedAt: new Date().toISOString(),
      };
      isNewUser = false;
    } else {
      // New user - check if they just registered
      isNewUser = !newUserPhones.has(phone);
      
      if (isNewUser) {
        // Mark as registered for next time
        newUserPhones.add(phone);
      }

      // Create new user record
      const isAdmin = ADMIN_PHONES.includes(phone);
      user = {
        id: `user-${Date.now()}`,
        phone,
        name: null, // New user needs to set name
        email: null,
        address: null,
        role: isAdmin ? 'ADMIN' : 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const token = generateToken(user.id);

    return successResponse({
      message: 'OTP verified successfully',
      token,
      user,
      isNewUser,
    });
  } catch {
    return errorResponse(
      'VERIFICATION_FAILED',
      'Failed to verify OTP. Please try again',
      500
    );
  }
}
