import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const dummyDelay = async <T extends {}>(ms: number, data: T) => {
  return new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));
};

export const getPrefixLinks = () => {
  const base =
    process.env.NEXT_PUBLIC_LINKS_APP ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  return `${base}/links/`;
};

export const getLinks = (text: string): string => {
  return new URL(text, getPrefixLinks()).href;
};
