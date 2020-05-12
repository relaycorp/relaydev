export function parseDate(val: string): Date {
  const date = new Date(val);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date "${val}"`);
  }
  return date;
}
