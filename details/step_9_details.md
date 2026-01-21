# STEP 9: AUTHENTICATION SYSTEM (PHONE OTP MOCK) - DETAILED BREAKDOWN

**Date Completed**: January 21, 2026  
**Status**: ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [Multi-Step Form Pattern](#multi-step-form-pattern)
3. [OTP Input Component Architecture](#otp-input-component-architecture)
4. [API Changes: International Phone Support](#api-changes-international-phone-support)
5. [New User Detection Flow](#new-user-detection-flow)
6. [Admin Role Detection](#admin-role-detection)
7. [Token Verification Pattern Change](#token-verification-pattern-change)
8. [Profile API Introduction](#profile-api-introduction)
9. [Resend Timer Implementation](#resend-timer-implementation)
10. [AuthContext Update](#authcontext-update)

---

## Overview

Step 9 implemented the complete authentication UI with a phone OTP-based login flow. The backend APIs existed from Step 4, but this step added the frontend components and enhanced the APIs for real-world usage patterns.

**What was accomplished:**
- ✅ Full login page with multi-step form (phone → OTP → name)
- ✅ Custom 6-digit OTP input with keyboard navigation
- ✅ International phone number support
- ✅ New user detection with name collection flow
- ✅ Admin role detection by phone number
- ✅ Profile update API for new users

**Files Created:**
```
store/src/
├── app/login/
│   └── page.tsx                # Login page with redirect support
├── app/api/auth/profile/
│   └── route.ts                # GET/PUT profile endpoints
└── components/auth/
    ├── LoginForm.tsx           # Multi-step authentication form
    ├── OtpInput.tsx            # Custom 6-digit input
    └── index.ts                # Barrel exports
```

**Files Modified:**
```
store/src/
├── app/api/auth/send-otp/route.ts    # International phone, resendAvailableIn
├── app/api/auth/verify-otp/route.ts  # Admin detection, isNewUser flag
└── context/AuthContext.tsx           # Fixed profile API path
```

---

## Multi-Step Form Pattern

### The Problem

Authentication requires multiple sequential steps that must be completed in order. Each step has its own validation, loading state, and error handling.

### State Machine Approach

Instead of managing multiple boolean flags, the form uses a single `step` state:

```typescript
type FormStep = 'phone' | 'otp' | 'name';
const [step, setStep] = useState<FormStep>('phone');
```

### Flow Transitions

```
┌─────────┐   sendOtp()   ┌─────────┐   verifyOtp()   ┌─────────┐
│  phone  │ ──────────▶   │   otp   │ ────────────▶   │  name   │
└─────────┘   success     └─────────┘   isNewUser     └─────────┘
                               │                           │
                               │ !isNewUser                │ saveName()
                               ▼                           ▼
                          ┌─────────────────────────────────────┐
                          │            REDIRECT                  │
                          └─────────────────────────────────────┘
```

### Why This Pattern?

- **Single source of truth**: One variable controls the entire UI
- **Predictable**: Clear transitions, no invalid states
- **Testable**: Easy to mock different steps
- **Back navigation**: Simple `setStep('phone')` to go back

---

## OTP Input Component Architecture

### The Challenge

A 6-digit OTP input requires complex keyboard handling:
- Auto-focus to next input on digit entry
- Backspace should clear and move left
- Paste should fill all digits
- Arrow keys for navigation

### Ref Array Pattern

```typescript
const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

// Access individual inputs
inputRefs.current[index]?.focus();
```

### Key Handlers

| Key | Behavior |
|-----|----------|
| Digit (0-9) | Fill current, move to next |
| Backspace | Clear current OR clear previous + move left |
| ArrowLeft | Move focus left |
| ArrowRight | Move focus right |
| Paste | Fill all digits from clipboard |

### Paste Handling

```typescript
const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
  if (pastedData) {
    onChange(pastedData);
    focusInput(Math.min(pastedData.length, 5)); // Focus last filled or next empty
  }
};
```

### Value as String Pattern

The parent component manages the OTP as a single string, while the child component renders individual inputs:

```typescript
// Parent: single string state
const [otp, setOtp] = useState('');

// Child: splits into array for display
const valueArray = value.split('').slice(0, 6);
```

**Why?**: Simpler parent state, validation is just `otp.length === 6`.

---

## API Changes: International Phone Support

### Previous Validation (Step 4)

```typescript
// Only Indian numbers
if (!phone || !/^\+91[0-9]{10}$/.test(phone)) {
  return errorResponse('INVALID_PHONE', ...);
}
```

### Updated Validation (Step 9)

```typescript
// International format: + followed by 10-15 digits
if (!phone || !/^\+[0-9]{10,15}$/.test(phone)) {
  return errorResponse('INVALID_PHONE', ...);
}
```

### Frontend Country Code Selector

```typescript
const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
];
```

The phone is constructed as: `${countryCode}${phoneNumber}`

---

## New User Detection Flow

### The Problem

First-time users need to provide their name. How does the frontend know if a user is new?

### Backend Detection

The `verify-otp` API now tracks known users and returns an `isNewUser` flag:

```typescript
// Known users (mock database)
const KNOWN_USERS: Record<string, {...}> = {
  '+919849067667': { id: 'admin-1', name: 'Admin User', ... },
  '+919876543210': { id: 'user-1', name: 'Test User', ... },
};

// Track new registrations in memory
const newUserPhones = new Set<string>();

// In verify-otp handler:
const knownUser = KNOWN_USERS[phone];

if (knownUser) {
  return { ...response, user: knownUser, isNewUser: false };
} else {
  const isNewUser = !newUserPhones.has(phone);
  if (isNewUser) newUserPhones.add(phone);
  return { ...response, user: newUser, isNewUser };
}
```

### Frontend Response

```typescript
const result = await login(phone, otp);

if (result.isNewUser) {
  setStep('name');  // Show name input
} else {
  router.push(redirectUrl);  // Go to destination
}
```

---

## Admin Role Detection

### The Logic

Admin role is determined solely by phone number in the mock implementation:

```typescript
const ADMIN_PHONES = ['+919849067667'];

// In user creation:
const isAdmin = ADMIN_PHONES.includes(phone);
const user = {
  ...userData,
  role: isAdmin ? 'ADMIN' : 'USER',
};
```

### Why Phone-Based?

- **Simple for mock**: No separate admin login flow
- **Realistic**: Many Indian apps use phone as primary identifier
- **Secure enough for demo**: Real system would have additional checks

### Admin Phone Numbers

| Phone | User | Role |
|-------|------|------|
| +919849067667 | Store Owner | ADMIN |
| Any other | Customer | USER |

---

## Token Verification Pattern Change

### The Issue

The `verifyToken()` function returns an object, not just a string:

```typescript
// Return type
export const verifyToken = (token: string): { userId: string; exp: number } | null => {
  // ...
};
```

### Profile API Fix

Original (incorrect):
```typescript
const userId = verifyToken(token);  // userId is an object!
userProfiles[userId] = ...;          // Type error: object as index
```

Fixed:
```typescript
const tokenData = verifyToken(token);
if (!tokenData) return errorResponse(...);

const userId = tokenData.userId;     // Extract string
userProfiles[userId] = ...;          // Correct: string as index
```

---

## Profile API Introduction

### Purpose

New users need to save their name after OTP verification. The profile API provides this capability.

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/auth/profile` | Fetch current user profile |
| PUT | `/api/auth/profile` | Update profile fields |

### PUT Request/Response

**Request:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",  // optional
  "address": "123 Street"          // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user-123",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "USER",
    "updatedAt": "2026-01-21T..."
  }
}
```

### In-Memory Storage

For the mock implementation, profiles are stored in memory:

```typescript
const userProfiles: Record<string, { name?: string; email?: string; address?: string }> = {};
```

**Note**: Data resets on server restart. Real implementation will use database.

---

## Resend Timer Implementation

### UX Requirement

Prevent OTP spam by enforcing a cooldown period before resend is allowed.

### Implementation

```typescript
const [resendTimer, setResendTimer] = useState(0);

// Start timer on OTP send
setResendTimer(30);

// Countdown effect
useEffect(() => {
  if (resendTimer > 0) {
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }
}, [resendTimer]);
```

### UI States

| Timer State | Button Text | Enabled |
|-------------|------------|---------|
| `> 0` | "Resend in 28s" | No |
| `= 0` | "Resend OTP" | Yes |

### API Support

The `send-otp` response now includes when resend is available:

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300,
  "resendAvailableIn": 30
}
```

---

## AuthContext Update

### Change Made

Fixed the profile update API path:

**Before:**
```typescript
const response = await api.put('/user/profile', data);
```

**After:**
```typescript
const response = await api.put('/auth/profile', data);
```

### User State Merge Pattern

When updating profile, merge new data with existing user state:

```typescript
const updateProfile = useCallback(async (data: Partial<User>) => {
  const response = await api.put('/auth/profile', data);
  if (response.data.success) {
    // Merge instead of replace
    setUser(prev => prev ? { ...prev, ...response.data.user } : response.data.user);
    return true;
  }
  return false;
}, []);
```

**Why merge?**: The profile API may only return updated fields, not the complete user object.

---

## Summary of API Changes

### /api/auth/send-otp (Updated)

| Field | Before | After |
|-------|--------|-------|
| Phone validation | `+91` + 10 digits only | `+` + 10-15 digits |
| Response | `expiresIn` only | Added `resendAvailableIn: 30` |
| Console output | Simple log | Formatted box with OTP |

### /api/auth/verify-otp (Updated)

| Field | Before | After |
|-------|--------|-------|
| Phone validation | India only | International |
| User returned | Fixed mock user | Dynamic based on phone |
| `isNewUser` | Always `false` | Tracks first login |
| Admin detection | None | By phone number |

### /api/auth/profile (New)

| Method | Purpose |
|--------|---------|
| GET | Fetch profile (requires auth) |
| PUT | Update name/email/address (requires auth) |
