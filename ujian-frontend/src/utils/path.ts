// utils/path.ts

/**
 * Split pathname into segments, filter empty, and capitalize last segment.
 */
export function getCurrentLabel(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length ? capitalize(segments[segments.length - 1]) : "";
}

/**
 * Capitalize each word and replace hyphens with spaces.
 */
export function capitalize(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
