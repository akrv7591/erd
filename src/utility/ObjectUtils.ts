export const objValuesToArray = <T>(obj: Record<string, T>) => {
  return Array.from(Object.values(obj? obj: {}))
}
