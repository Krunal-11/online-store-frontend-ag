'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context';
import { useWishlist } from '@/hooks';
import { MobileNav } from './MobileNav';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems: wishlistCount } = useWishlist();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/wishlist');
    } else {
      router.push('/wishlist');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-background transition-shadow duration-200 ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        {/* Desktop Header - Single Row */}
        <div className="hidden md:block">
          <div className="container-main">
            <div className="flex h-16 items-center justify-between gap-4">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex-shrink-0 text-xl font-bold text-primary hover:text-primary/90 transition-colors"
              >
                New Guru Enterprises
              </Link>

              {/* Search Bar - Desktop */}
              <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 h-10 bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </form>

              {/* Right Section - Icons */}
              <div className="flex items-center gap-2">
                {/* Wishlist */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWishlistClick}
                  className="relative"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground"
                    >
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </Badge>
                  )}
                </Button>

                {/* User Menu */}
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="User menu">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user?.name || 'User'}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">My Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wishlist">My Wishlist</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user?.role === 'ADMIN' && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="text-primary font-medium">
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem 
                        onClick={logout}
                        className="text-destructive focus:text-destructive"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header - Two Rows */}
        <div className="md:hidden">
          {/* Row 1: Menu, Logo, Icons */}
          <div className="container-main">
            <div className="flex h-14 items-center justify-between gap-2">
              {/* Hamburger Menu */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileNavOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Logo - Centered */}
              <Link 
                href="/" 
                className="flex-1 text-center text-lg font-bold text-primary truncate px-2"
              >
                New Guru Enterprises
              </Link>

              {/* Icons */}
              <div className="flex items-center gap-1">
                {/* Wishlist */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleWishlistClick}
                  className="relative"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-accent text-accent-foreground"
                    >
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </Badge>
                  )}
                </Button>

                {/* User */}
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="User menu">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user?.name || 'User'}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">My Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wishlist">My Wishlist</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user?.role === 'ADMIN' && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="text-primary font-medium">
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem 
                        onClick={logout}
                        className="text-destructive focus:text-destructive"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => router.push('/login')}
                    aria-label="Login"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Search Bar */}
          <div className="container-main pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </>
  );
}
