import {useQuery} from "@tanstack/react-query";
import erdApi from "@/api/erdApi.ts";
import type {Resources} from "@/types/data/db-model-interfaces.ts";
import type {ReactNode} from "react";


type ResourceKeys = keyof Resources
type ResourceType<T extends ResourceKeys> = Resources[T]

const getQueryFn = <T extends ResourceKeys, V extends ResourceType<T>>(type: T, resourceId: V['id'])=> {
  switch (type) {
    case "staticFile":
      return async () => erdApi.get<V>(`/v1/static-files/${resourceId}`).then(res => res.data)
    case "erd":
      return async () => erdApi.get<V>(`/v1/erds/${resourceId}`).then(res => res.data)
  }
}

interface Props<T extends ResourceKeys> {
  name: T
  resourceId: string
  fallback?: ReactNode
  renderer: (data: ResourceType<T>) => ReactNode
}

export const ResourceProvider = <T extends ResourceKeys,>(props: Props<T>) => {

  const query = useQuery({
    queryKey: [props.name, props.resourceId],
    queryFn: getQueryFn(props.name, props.resourceId),
  })

  const {data, isSuccess} = query

  if (!isSuccess || !data) {
    return props.fallback || null
  }

  return props.renderer(data)
}
