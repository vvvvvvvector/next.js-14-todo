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

export function formatTime(date: string) {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
}
