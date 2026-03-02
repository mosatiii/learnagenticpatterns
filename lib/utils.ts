import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPatternNumber(num: number): string {
  return `[${num.toString().padStart(2, "0")}]`;
}
