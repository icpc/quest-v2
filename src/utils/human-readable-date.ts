export function formatDate(
  date: string | Date,
  rules: Intl.DateTimeFormatOptions,
) {
  return new Date(date).toLocaleDateString("en-US", rules);
}
