import { type ClassValue, clsx } from 'clsx';

/**
 * Utility for conditional class names
 * Simple implementation without tailwind-merge for lightweight usage
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
