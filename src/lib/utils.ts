import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatUserDate(date: any, locale: string = 'en', includeTime: boolean = false): string {
  if (!date) return '—';
  try {
    let d: Date;
    if (typeof date.toDate === 'function') {
      d = date.toDate();
    } else if (date.seconds !== undefined) {
      d = new Date(date.seconds * 1000 + (date.nanoseconds ? date.nanoseconds / 1000000 : 0));
    } else if (date instanceof Date) {
      d = date;
    } else if (typeof date === 'number') {
      d = new Date(date);
    } else if (typeof date === 'string') {
      if (/^\d+$/.test(date)) {
        d = new Date(parseInt(date, 10));
      } else {
        d = new Date(date);
      }
    } else if (date && typeof date === 'object' && date._seconds !== undefined) {
      d = new Date(date._seconds * 1000);
    } else {
      d = new Date(date);
    }

    if (isNaN(d.getTime())) {
      return '—';
    }

    const dateLocale = locale === 'ar' ? 'ar-EG' : 'en-US';
    if (includeTime) {
      return d.toLocaleString(dateLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return d.toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error("formatUserDate error:", error);
    return '—';
  }
}
