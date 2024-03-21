import {useState} from "react";

export interface IListQuery {
  q: string;
  limit: number;
  offset: number;
  order: [string, string][]

  [key: string]: any
}

const defaultData: IListQuery = {
  q: "",
  limit: 10,
  offset: 0,
  order: [['createdAt', "desc"]]
}

export const useListQuery = (initData: Partial<IListQuery> = defaultData) => {
  const [params, set] = useState({...defaultData, ...initData})
  const setParams = (params: Partial<IListQuery>) => set(cur => ({...cur, ...params}))
  const setSearch = (q: string) => setParams({q, offset: 0})

  return {params, setParams, setSearch}
}
