import {QueryFunction, useQuery} from "@tanstack/react-query";
import type {Resources} from "@/types/data/db-model-interfaces";
import type { ReactNode } from "react";
import {staticFileApis} from "@/api/staticFile.ts";
import {erdApis} from "@/api/erd.ts";

type ResourceKeys = keyof Resources;
type ResourceType<T extends ResourceKeys> = Resources[T];

const getQueryFn = <T extends ResourceKeys>(type: T): QueryFunction<ResourceType<T>, [string, string]> => {
  switch (type) {
    case "Erd":
      return erdApis.detail;
    case "StaticFile":
      return staticFileApis.detail;
    default:
      throw new Error(`Invalid resource type: ${type}`);
  }
}

interface Props<T extends ResourceKeys> {
  name: T;
  resourceId: string;
  fallback?: ReactNode;
  renderer: (data: ResourceType<T>) => ReactNode;
}

export const ResourceProvider = <T extends ResourceKeys,>(props: Props<T>) => {
  const query = useQuery({
    queryKey: [props.name, props.resourceId],
    queryFn: getQueryFn(props.name),
  });

  const { data, isSuccess } = query;

  if (!isSuccess || !data) {
    return props.fallback || null;
  }

  return props.renderer(data);
};
