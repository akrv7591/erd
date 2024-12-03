import {FC} from "react";
import {NodeProps} from "@xyflow/react";
import {Content} from "./Content";
import type {EntityNode as EntityNodeType} from "@/types/diagram";

export const EntityNode: FC<NodeProps<EntityNodeType>> = () => {
  return (
    <Content />
  )
}
