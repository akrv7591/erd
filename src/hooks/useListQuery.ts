import {useCallback, useEffect, useState} from "react";

export interface IListQuery {
  q: string;
  limit: number;
  offset: number;
  order: [string, string][]
  containerHeight?: number
  elementHeight?: number

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
  const setParams = useCallback((params: Partial<IListQuery>) => set(cur => ({...cur, ...params})), [])
  const setSearch = useCallback((q: string) => setParams({q, offset: 0}), [])

  useEffect(() => {
    if (initData.containerHeight && initData.elementHeight && initData.containerHeight > 0) {
      setParams({
        limit: Math.ceil(initData.containerHeight! / initData.elementHeight!)
      })
    }
  }, [initData.containerHeight, initData.elementHeight])

  return {params, setParams, setSearch}
}
