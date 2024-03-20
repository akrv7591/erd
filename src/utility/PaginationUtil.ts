import {IListQuery} from "@/hooks/useListQuery.ts";

export class PaginationUtil {
  static getOffset(params: IListQuery, page: number) {
    return (page - 1) * params.limit
  }

  static getPageCount(params: IListQuery, count: number) {
    return Math.ceil(count / params.limit)
  }
}
