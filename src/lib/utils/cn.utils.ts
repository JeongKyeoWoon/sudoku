import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * tailwindcss의 class를 조합하여 반환
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
