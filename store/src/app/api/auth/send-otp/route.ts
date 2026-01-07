import { NextRequest } from 'next/server';
import { delay, successResponse, errorResponse } from '@/lib/mock-helpers';

export async function POST(request: NextRequest) {
  await delay(200);

  try {
    const body = await request.json();
    const { phone } = body;

    // Validate phone number (basic validation)
    if (!phone || !/^\+91[0-9]{10}$/.test(phone)) {
      return errorResponse(
        'INVALID_PHONE',
        'Please provide a valid phone number (+91 followed by 10 digits)',
        400
      );
    }

    // Mock: Always succeed and log OTP to console
    console.log(`[MOCK] OTP for ${phone}: 123456`);

    return successResponse({
      message: `OTP sent successfully to ${phone}`,
      expiresIn: 300, // 5 minutes
    });
  } catch {
    return errorResponse(
      'OTP_SEND_FAILED',
      'Failed to send OTP. Please try again',
      500
    );
  }
}
