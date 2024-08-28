import { FC, memo } from "react";
import {NodeProps} from "@xyflow/react";
import { Content } from "./Content";
import type { EntityNode as EntityNodeType } from "@/providers/shared-diagram-store-provider/type";

export const EntityNode: FC<NodeProps<EntityNodeType>> = memo((props) => {
  const {data, id} = props
  return (
    <Content data={data} id={id}/>
  )
})
