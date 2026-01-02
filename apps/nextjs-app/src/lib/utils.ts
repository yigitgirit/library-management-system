import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import slugifyLib from "slugify"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: 'tr',
    trim: true
  });
}

export function createBookSlug(id: number | string, title: string): string {
  return `${slugify(title)}-${id}`;
}

export function extractIdFromSlug(slug: string): number {
  const parts = slug.split('-');
  const id = parts[parts.length - 1];
  return Number(id);
}

export function formatDate(dateString?: string) {
    if (!dateString) return "-";
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
}
