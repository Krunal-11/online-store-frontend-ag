'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Package, Truck, RotateCcw } from 'lucide-react';
import type { ProductVariant } from '@/types';

interface ProductAccordionProps {
  selectedVariant: ProductVariant;
}

export function ProductAccordion({ selectedVariant }: ProductAccordionProps) {
  // Parse variant attributes for specifications table
  const attributes = selectedVariant.attributes || {};
  const hasAttributes = Object.keys(attributes).length > 0;

  return (
    <Accordion type="multiple" className="w-full" defaultValue={['specifications']}>
      {/* Specifications */}
      {hasAttributes && (
        <AccordionItem value="specifications">
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-500" />
              <span>Specifications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(attributes).map(([key, value]) => (
                    <tr key={key}>
                      <td className="py-2 pr-4 text-gray-500 font-medium capitalize whitespace-nowrap">
                        {formatAttributeKey(key)}
                      </td>
                      <td className="py-2 text-gray-900">
                        {formatAttributeValue(value)}
                      </td>
                    </tr>
                  ))}
                  {/* Add SKU */}
                  <tr>
                    <td className="py-2 pr-4 text-gray-500 font-medium whitespace-nowrap">
                      SKU
                    </td>
                    <td className="py-2 text-gray-900 font-mono text-xs">
                      {selectedVariant.sku}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Delivery Information */}
      <AccordionItem value="delivery">
        <AccordionTrigger className="text-left">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-gray-500" />
            <span>Delivery Information</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Standard Delivery</p>
                <p>4-7 business days • Free on orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Express Delivery</p>
                <p>1-2 business days • ₹99 for orders under ₹999</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 pt-2">
              Delivery times may vary based on location and product availability.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Return Policy */}
      <AccordionItem value="returns">
        <AccordionTrigger className="text-left">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-gray-500" />
            <span>Return Policy</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">7-Day Easy Returns</p>
                <p>Return within 7 days of delivery for a full refund</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Conditions Apply</p>
                <p>Product must be unused and in original packaging</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Free Pickup</p>
                <p>We'll arrange free pickup from your doorstep</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// Helper to format attribute keys (e.g., "powerWattage" → "Power Wattage")
function formatAttributeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// Helper to format attribute values
function formatAttributeValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(value);
}

// Skeleton for loading state
export function ProductAccordionSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
