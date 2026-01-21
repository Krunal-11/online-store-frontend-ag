'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/context';
import { OtpInput } from './OtpInput';

type FormStep = 'phone' | 'otp' | 'name';

interface LoginFormProps {
  redirectUrl?: string;
}

// Common country codes
const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
];

export function LoginForm({ redirectUrl = '/' }: LoginFormProps) {
  const router = useRouter();
  const { sendOtp, login, updateProfile } = useAuth();

  // Form state
  const [step, setStep] = useState<FormStep>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  
  // Loading states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  
  // Error states
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Resend OTP timer
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Get full phone number with country code
  const getFullPhone = useCallback(() => {
    return `${countryCode}${phoneNumber}`;
  }, [countryCode, phoneNumber]);

  // Mask phone for display
  const getMaskedPhone = useCallback(() => {
    const full = getFullPhone();
    if (full.length > 6) {
      return `${full.slice(0, -4)}XXXX`;
    }
    return full;
  }, [getFullPhone]);

  // Validate phone number
  const validatePhone = (): boolean => {
    setPhoneError('');
    
    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    // For India, expect 10 digits
    if (countryCode === '+91' && phoneNumber.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    // Basic validation for other countries (6-15 digits)
    if (phoneNumber.length < 6 || phoneNumber.length > 15) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

  // Validate OTP
  const validateOtp = (): boolean => {
    setOtpError('');
    
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP');
      return false;
    }
    
    return true;
  };

  // Validate name
  const validateName = (): boolean => {
    setNameError('');
    
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    
    return true;
  };

  // Handle send OTP
  const handleSendOtp = async () => {
    if (!validatePhone()) return;
    
    setIsSendingOtp(true);
    
    try {
      const result = await sendOtp(getFullPhone());
      
      if (result.success) {
        setStep('otp');
        setResendTimer(30); // 30 seconds before resend
        toast.success('OTP sent successfully!');
      } else {
        setPhoneError(result.error || 'Failed to send OTP');
        toast.error(result.error || 'Failed to send OTP');
      }
    } catch {
      setPhoneError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setOtp('');
    setOtpError('');
    await handleSendOtp();
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;
    
    setIsVerifyingOtp(true);
    
    try {
      const result = await login(getFullPhone(), otp);
      
      if (result.success) {
        if (result.isNewUser) {
          setStep('name');
          toast.success('OTP verified! Please complete your profile.');
        } else {
          toast.success('Login successful!');
          router.push(redirectUrl);
        }
      } else {
        setOtpError(result.error || 'Invalid OTP');
        toast.error(result.error || 'Invalid OTP');
      }
    } catch {
      setOtpError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle save name
  const handleSaveName = async () => {
    if (!validateName()) return;
    
    setIsSavingName(true);
    
    try {
      const success = await updateProfile({ name: name.trim() });
      
      if (success) {
        toast.success('Welcome to New Guru Enterprises!');
        router.push(redirectUrl);
      } else {
        setNameError('Failed to save name. Please try again.');
        toast.error('Failed to save name');
      }
    } catch {
      setNameError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSavingName(false);
    }
  };

  // Handle back to phone step
  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setOtpError('');
    setResendTimer(0);
  };

  // Handle key press for form submission
  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  // Render phone input step
  const renderPhoneStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-[100px] sm:w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_CODES.map((cc) => (
                <SelectItem key={cc.code} value={cc.code}>
                  <span className="flex items-center gap-2">
                    <span>{cc.flag}</span>
                    <span>{cc.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setPhoneNumber(value);
                setPhoneError('');
              }}
              onKeyPress={(e) => handleKeyPress(e, handleSendOtp)}
              className="pl-10"
              maxLength={15}
              disabled={isSendingOtp}
            />
          </div>
        </div>
        {phoneError && (
          <p className="text-sm text-destructive">{phoneError}</p>
        )}
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={handleSendOtp}
        disabled={isSendingOtp || !phoneNumber}
      >
        {isSendingOtp ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending OTP...
          </>
        ) : (
          'Send OTP'
        )}
      </Button>
    </div>
  );

  // Render OTP input step
  const renderOtpStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          OTP sent to <span className="font-medium text-foreground">{getMaskedPhone()}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label className="sr-only">Enter OTP</Label>
        <OtpInput
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setOtpError('');
          }}
          length={6}
          disabled={isVerifyingOtp}
          error={!!otpError}
        />
        {otpError && (
          <p className="text-sm text-destructive text-center">{otpError}</p>
        )}
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={handleVerifyOtp}
        disabled={isVerifyingOtp || otp.length !== 6}
      >
        {isVerifyingOtp ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify OTP'
        )}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={handleBackToPhone}
          className="text-primary hover:underline flex items-center gap-1"
          disabled={isVerifyingOtp}
        >
          <ArrowLeft className="h-3 w-3" />
          Change number
        </button>
        
        <button
          type="button"
          onClick={handleResendOtp}
          className={`${
            resendTimer > 0
              ? 'text-muted-foreground cursor-not-allowed'
              : 'text-primary hover:underline'
          }`}
          disabled={resendTimer > 0 || isVerifyingOtp}
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );

  // Render name input step
  const renderNameStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold">Welcome! 🎉</h2>
        <p className="text-sm text-muted-foreground">
          Please enter your name to complete your profile
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError('');
          }}
          onKeyPress={(e) => handleKeyPress(e, handleSaveName)}
          disabled={isSavingName}
          autoFocus
        />
        {nameError && (
          <p className="text-sm text-destructive">{nameError}</p>
        )}
      </div>

      <Button
        type="button"
        className="w-full"
        onClick={handleSaveName}
        disabled={isSavingName || !name.trim()}
      >
        {isSavingName ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      {step === 'phone' && renderPhoneStep()}
      {step === 'otp' && renderOtpStep()}
      {step === 'name' && renderNameStep()}
    </form>
  );
}
