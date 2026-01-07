import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t">
      {/* Main Footer Content */}
      <div className="container-main py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Store Info */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">
              New Guru Enterprises
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Wide Range of home appliances and kitchenware
            </p>
            
            {/* Delivery Badge */}
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-full text-sm font-medium">
              <Truck className="h-4 w-4" />
              Home Delivery Available
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Contact Us
            </h3>
            
            <div className="space-y-3">
              {/* Phone */}
              <a 
                href="tel:+919849067667" 
                className="flex items-start gap-3 text-sm hover:text-primary transition-colors group"
              >
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary" />
                <span>+91 98490 67667</span>
              </a>
              
              {/* Address */}
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <address className="not-italic text-muted-foreground">
                  No. 5-4-726/1, Nampally Station Road<br />
                  ABIDS SOUTH, Hyderabad<br />
                  Telangana, 500001 India
                </address>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Quick Links
            </h3>
            
            <nav className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/categories">All Categories</FooterLink>
              <FooterLink href="/wishlist">My Wishlist</FooterLink>
              <FooterLink href="/profile">My Account</FooterLink>
            </nav>
          </div>
        </div>
      </div>

      <Separator />

      {/* Copyright */}
      <div className="container-main py-4">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} New Guru Enterprises. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// Helper component for footer links
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}
