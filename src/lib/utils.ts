import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToAscii = (inputString: string) => {
  return inputString.replace(/[^\x20-\x7E]+/g, "").replace(/[\s.-]+/g, "_"); // Replace any non-printable ASCII chars and spaces, periods, and hyphens with an underscore
};
