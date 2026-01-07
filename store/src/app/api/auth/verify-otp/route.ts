import { NextRequest } from 'next/server';
import { delay, successResponse, errorResponse, generateToken } from '@/lib/mock-helpers';

// Fixed mock user for simplicity (as per user's choice)
const MOCK_USER = {
  id: 'user-1',
  phone: '+919876543210',
  name: 'Test User',
  email: 'testuser@example.com',
  address: '123, Test Street, Hyderabad',
  role: 'USER' as const,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: new Date().toISOString(),
};

export async function POST(request: NextRequest) {
  await delay(200);

  try {
    const body = await request.json();
    const { phone, otp } = body;

    // Validate phone number
    if (!phone || !/^\+91[0-9]{10}$/.test(phone)) {
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

    // Mock: Accept any 6-digit OTP
    // Return fixed mock user
    const token = generateToken(MOCK_USER.id);

    return successResponse({
      message: 'OTP verified successfully',
      token,
      user: {
        ...MOCK_USER,
        phone, // Use the phone number they entered
      },
      isNewUser: false,
    });
  } catch {
    return errorResponse(
      'VERIFICATION_FAILED',
      'Failed to verify OTP. Please try again',
      500
    );
  }
}
