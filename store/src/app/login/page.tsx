'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context';
import { LoginForm } from '@/components/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  
  const redirectUrl = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-secondary/30">
      {/* Logo/Brand */}
      <Link 
        href="/" 
        className="mb-8 text-2xl font-bold text-primary hover:text-primary/90 transition-colors"
      >
        New Guru Enterprises
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Sign in to your account
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter your phone number to continue
          </p>
        </div>

        <LoginForm redirectUrl={redirectUrl} />
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-muted-foreground text-center">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
