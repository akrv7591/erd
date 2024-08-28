export interface IApiList<T> {
  count: number;
  rows: T[]
}

export interface IApiListConfig<T> {
  q?: string;
  limit: number;
  offset: number;
  order: [[key: keyof T], "asc" | "desc"][];
}
