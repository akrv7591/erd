import {useState} from "react";

export interface IListQuery {
  q: string;
  limit: number;
  offset: number;
  order: [string, string][]
}

const defaultData: IListQuery = {
  q: "",
  limit: 10,
  offset: 0,
  order: [['createdAt', "desc"]]
}

export const useListQuery = (initData: IListQuery = defaultData) => {
  const [params, set] = useState(initData)
  const setParams = (params: Partial<IListQuery>) => set(cur => ({...cur, ...params}))

  return {params, setParams}
}
