import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Indian Rupee Currency Formatter (₹ x,xx,xxx.xx)
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0.00";
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const parts = absAmount.toFixed(2).split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return (isNegative ? "-₹" : "₹") + formattedInteger + "." + decimalPart;
}

// Indian Number to Words converter (e.g., INR Fourteen Lakh Fifty Thousand Only)
export function numberToIndianWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";

  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + "Hundred " + (n % 100 !== 0 ? "and " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + "Thousand " + (n % 1000 !== 0 ? inWords(n % 1000) : "");
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + "Lakh " + (n % 100000 !== 0 ? inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + "Crore " + (n % 10000000 !== 0 ? inWords(n % 10000000) : "");
  }

  const integerVal = Math.floor(Math.abs(num));
  const paiseVal = Math.round((Math.abs(num) - integerVal) * 100);

  let words = "INR " + inWords(integerVal).trim();
  if (paiseVal > 0) {
    words += " and " + inWords(paiseVal).trim() + " Paise";
  }
  words += " Only";

  return words;
}

// Generate Realistic 64-char IRN Hash for e-Invoicing
export function generateMockIRN(gstin: string, docNo: string, fy: string = "26-27"): string {
  const raw = `${gstin}-${docNo}-${fy}-${Date.now()}`;
  let hash = "";
  for (let i = 0; i < 64; i++) {
    const charCode = (raw.charCodeAt(i % raw.length) * (i + 13)) % 16;
    hash += charCode.toString(16);
  }
  return hash;
}

// Generate 12-digit e-Way Bill Number
export function generateMockEWayBill(): string {
  const digits = Math.floor(100000000000 + Math.random() * 900000000000);
  return digits.toString();
}

// State code list mapping for India GST
export const INDIA_STATES: { code: string; name: string }[] = [
  { code: "01", name: "Jammu and Kashmir" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "03", name: "Punjab" },
  { code: "04", name: "Chandigarh" },
  { code: "05", name: "Uttarakhand" },
  { code: "06", name: "Haryana" },
  { code: "07", name: "Delhi" },
  { code: "08", name: "Rajasthan" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "10", name: "Bihar" },
  { code: "19", name: "West Bengal" },
  { code: "24", name: "Gujarat" },
  { code: "27", name: "Maharashtra" },
  { code: "29", name: "Karnataka" },
  { code: "32", name: "Kerala" },
  { code: "33", name: "Tamil Nadu" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Andhra Pradesh" },
];

export function getStateByCode(code: string): string {
  const found = INDIA_STATES.find((s) => s.code === code);
  return found ? found.name : "Other Territory";
}

export function getStateCodeFromGSTIN(gstin: string): string {
  if (!gstin || gstin.length < 2) return "27"; // Default to Maharashtra
  return gstin.substring(0, 2);
}
