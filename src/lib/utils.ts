import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class TurkishNumberConverter {
  private static readonly ones = [
    "",
    "bir",
    "iki",
    "üç",
    "dört",
    "beş",
    "altı",
    "yedi",
    "sekiz",
    "dokuz",
  ];

  private static readonly tens = [
    "",
    "",
    "yirmi",
    "otuz",
    "kırk",
    "elli",
    "altmış",
    "yetmiş",
    "seksen",
    "doksan",
  ];

  private static readonly scales = ["", "bin", "milyon", "milyar", "trilyon"];

  public static convertToWords(num: number): string {
    if (num === 0) return "sıfır";
    if (num < 0) return "eksi " + this.convertToWords(-num);

    let result = "";
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkText = this.convertChunk(chunk, scaleIndex);
        result = chunkText + (result ? " " + result : "");
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result;
  }

  private static convertChunk(num: number, scaleIndex: number): string {
    let result = "";

    // Yüzler
    const hundreds = Math.floor(num / 100);
    if (hundreds > 0) {
      if (hundreds === 1) {
        result += "yüz";
      } else {
        result += this.ones[hundreds] + " yüz";
      }
    }

    // Onlar ve birler
    const remainder = num % 100;
    if (remainder > 0) {
      if (result) result += " ";

      if (remainder < 10) {
        // Birler hanesi
        if (scaleIndex === 1 && remainder === 1) {
          // "bir bin" yerine sadece "bin"
          result += "";
        } else {
          result += this.ones[remainder];
        }
      } else if (remainder === 10) {
        result += "on";
      } else if (remainder < 20) {
        // 11-19 arası
        const onesDigit = remainder - 10;
        result += "on " + this.ones[onesDigit];
      } else {
        // 20 ve üzeri
        const tensDigit = Math.floor(remainder / 10);
        const onesDigit = remainder % 10;

        result += this.tens[tensDigit];
        if (onesDigit > 0) {
          if (scaleIndex === 1 && onesDigit === 1) {
            // "yirmi bir bin" yerine "yirmi bin"
            result += "";
          } else {
            result += " " + this.ones[onesDigit];
          }
        }
      }
    }

    // Ölçek ekleme (bin, milyon, vb.)
    if (scaleIndex > 0 && scaleIndex < this.scales.length) {
      result += (result ? " " : "") + this.scales[scaleIndex];
    }

    return result;
  }

  public static convertToCurrency(amount: number, currency: string = "Türk Lirası"): string {
    const words = this.convertToWords(amount);
    const capitalizedWords = words.charAt(0).toUpperCase() + words.slice(1);
    return `${capitalizedWords} ${currency}`;
  }

  // Kuruş desteği ile
  public static convertToCurrencyWithCents(
    amount: number,
    currency: string = "Türk Lirası",
    centsName: string = "Kuruş"
  ): string {
    const liras = Math.floor(amount);
    const kurus = Math.round((amount - liras) * 100);

    let result = this.convertToCurrency(liras, currency);

    if (kurus > 0) {
      const kurusWords = this.convertToWords(kurus);
      const capitalizedKurus = kurusWords.charAt(0).toUpperCase() + kurusWords.slice(1);
      result += ` ${capitalizedKurus} ${centsName}`;
    }

    return result;
  }
}

export function formatCurrency(
  value: number | null | undefined,
  options: {
    locale?: string;
    currency?: string;
    min?: number;
    max?: number;
    showCurrencySymbol?: boolean;
  } = {}
): string {
  const {
    locale = "tr-TR",
    currency = "TRY",
    min = 2,
    max = 2,
    showCurrencySymbol = false,
  } = options;

  if (typeof value === "number" && !isNaN(value)) {
    return new Intl.NumberFormat(locale, {
      style: showCurrencySymbol ? "currency" : "decimal",
      currency,
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }).format(value);
  }

  return "";
}

export function toFixedNumber(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getInitialsForAvatar = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };