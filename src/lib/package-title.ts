/** Remove decorative dash separators from package / journey marketing titles. */
export function cleanPackageTitle(title: string): string {
  if (!title) return title;
  return title
    .replace(/\s*[—–]\s*|\s+-\s+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
