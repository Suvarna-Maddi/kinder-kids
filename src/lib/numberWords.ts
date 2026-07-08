// Convert a non-negative integer up to 999,999,999,999 into its English word
// form. Used by TTS so numbers are pronounced as words ("twenty-three")
// instead of digit strings.

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALES: Array<[number, string]> = [
  [1_000_000_000, "billion"],
  [1_000_000, "million"],
  [1_000, "thousand"],
  [100, "hundred"],
];

function underThousand(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`;
  }
  const h = Math.floor(n / 100);
  const r = n % 100;
  return r === 0 ? `${ONES[h]} hundred` : `${ONES[h]} hundred ${underThousand(r)}`;
}

export function numberToWords(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n < 0) return `negative ${numberToWords(-n)}`;
  n = Math.floor(n);
  if (n === 0) return "zero";
  const parts: string[] = [];
  for (const [value, name] of SCALES) {
    if (n >= value) {
      const count = Math.floor(n / value);
      n = n % value;
      if (name === "hundred") {
        parts.push(`${ONES[count]} hundred`);
      } else {
        parts.push(`${numberToWords(count)} ${name}`);
      }
    }
  }
  if (n > 0) parts.push(underThousand(n));
  return parts.join(" ");
}

/** Say a number aloud in words, e.g. speakNumber(23) -> "twenty-three". */
export const sayNumber = (n: number) => numberToWords(n);