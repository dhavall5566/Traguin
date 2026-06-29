/** Replace em dashes with natural punctuation in user-facing copy. */
export function humanizeCopy(text: string): string {
  if (!text.includes("—")) return text;

  return text
    .replace(/\s*—\s*/g, (match, offset) => {
      const after = text.slice(offset + match.length).trimStart();
      if (!after) return ", ";
      return /^[a-z]/.test(after) ? ", " : ". ";
    })
    .replace(/,\s*,/g, ", ")
    .replace(/\.\s*\./g, ".")
    .trim();
}

export function humanizeCopyList(items: string[]): string[] {
  return items.map((item) => humanizeCopy(item));
}
