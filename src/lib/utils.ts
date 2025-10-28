  // src/app/lib/utils.ts
  import { clsx, type ClassValue } from "clsx"
  import { twMerge } from "tailwind-merge"

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }

export function getFileUrlFromKey(key: string) {
  if (!key) return '';
  const baseUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;
  return `${baseUrl}/${key}`;
}
