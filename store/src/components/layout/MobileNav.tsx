'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, Home, Grid3X3, User, Heart, Package, LogOut, Shield } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context';
import { useMainCategories } from '@/hooks';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { categories, isLoading: categoriesLoading } = useMainCategories();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-primary font-bold">
              New Guru Enterprises
            </SheetTitle>
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-65px)] overflow-y-auto">
          {/* User Section */}
          <div className="p-4 bg-secondary/30">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.phone}</p>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => handleNavigation('/login')}
              >
                <User className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            )}
          </div>

          <Separator />

          {/* Quick Links */}
          <nav className="p-2">
            <NavItem 
              icon={<Home className="h-5 w-5" />} 
              label="Home" 
              onClick={() => handleNavigation('/')} 
            />
            <NavItem 
              icon={<Heart className="h-5 w-5" />} 
              label="My Wishlist" 
              onClick={() => handleNavigation(isAuthenticated ? '/wishlist' : '/login?redirect=/wishlist')} 
            />
            {isAuthenticated && (
              <>
                <NavItem 
                  icon={<User className="h-5 w-5" />} 
                  label="My Profile" 
                  onClick={() => handleNavigation('/profile')} 
                />
                <NavItem 
                  icon={<Package className="h-5 w-5" />} 
                  label="My Orders" 
                  onClick={() => handleNavigation('/orders')} 
                />
              </>
            )}
          </nav>

          <Separator />

          {/* Categories */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Categories
            </h3>
            <nav className="space-y-1">
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className="h-10 bg-secondary/50 rounded animate-pulse" 
                    />
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleNavigation(`/category/${category.slug}`)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                      <span>{category.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))
              )}
            </nav>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Admin & Logout Section */}
          {isAuthenticated && (
            <>
              <Separator />
              <div className="p-2">
                {user?.role === 'ADMIN' && (
                  <NavItem 
                    icon={<Shield className="h-5 w-5" />} 
                    label="Admin Panel" 
                    onClick={() => handleNavigation('/admin')}
                    className="text-primary"
                  />
                )}
                <NavItem 
                  icon={<LogOut className="h-5 w-5" />} 
                  label="Logout" 
                  onClick={handleLogout}
                  className="text-destructive hover:bg-destructive/10"
                />
              </div>
            </>
          )}

          {/* Store Info */}
          <div className="p-4 bg-secondary/30 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground">New Guru Enterprises</p>
            <p className="mt-1">📞 9849067667</p>
            <p className="mt-1">🚚 Home Delivery Available</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper component for navigation items
function NavItem({ 
  icon, 
  label, 
  onClick, 
  className = '' 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-secondary transition-colors text-left ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
