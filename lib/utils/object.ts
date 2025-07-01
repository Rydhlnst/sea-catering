export function cleanObject<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([v]) => v !== undefined)
  ) as T;
}
