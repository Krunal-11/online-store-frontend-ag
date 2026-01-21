import { NextRequest } from 'next/server';
import { delay, successResponse, errorResponse } from '@/lib/mock-helpers';

// Generate a random 6-digit OTP (for mock display in console)
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  await delay(200);

  try {
    const body = await request.json();
    const { phone } = body;

    // Validate phone number (supports international formats)
    // Format: + followed by 10-15 digits
    if (!phone || !/^\+[0-9]{10,15}$/.test(phone)) {
      return errorResponse(
        'INVALID_PHONE',
        'Please provide a valid phone number with country code',
        400
      );
    }

    // Generate mock OTP
    const otp = generateOtp();

    // Mock: Log OTP to console for testing
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log(`📱 OTP for ${phone}: ${otp}`);
    console.log('   (For testing, any 6-digit OTP will work)');
    console.log('═══════════════════════════════════════════');
    console.log('');

    return successResponse({
      message: `OTP sent successfully to ${phone}`,
      expiresIn: 300, // 5 minutes
      resendAvailableIn: 30, // Can resend after 30 seconds
    });
  } catch {
    return errorResponse(
      'OTP_SEND_FAILED',
      'Failed to send OTP. Please try again',
      500
    );
  }
}
