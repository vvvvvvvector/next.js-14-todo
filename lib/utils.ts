import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, month: 'short' | 'long' = 'long') {
  return new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month,
    year: 'numeric'
  });
}
