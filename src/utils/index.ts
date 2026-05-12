import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(dateStr));
}

export const ORDER_STATUS_CONFIG = {
  PENDING: { label: 'Pending', className: 'badge-gold' },
  CONFIRMED: { label: 'Confirmed', className: 'badge-blue' },
  SHIPPED: { label: 'Shipped', className: 'badge-blue' },
  DELIVERED: { label: 'Delivered', className: 'badge-green' },
  CANCELLED: { label: 'Cancelled', className: 'badge-red' },
} as const;
