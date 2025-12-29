import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import slugifyLib from "slugify"
import {z} from "zod";
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true, // Removes characters that aren't replacements (like emojis or symbols)
    locale: 'tr', // Helps prioritize Turkish rules if there's ambiguity
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
    // Convert Instant/ISO string to local date object
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
}
