import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertToAscii = (inputString: string) => {
  return inputString.replace(/[^\x00-\x7F]+/g, ""); //  Replace any non ascii chars with an empty str
};
