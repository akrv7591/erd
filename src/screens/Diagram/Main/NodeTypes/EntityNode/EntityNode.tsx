import { FC, memo } from "react";
import { NodeProps } from "@xyflow/react";
import { Content } from "./Content";
import type { EntityNode as EntityNodeType } from "@/types/diagram";
import { CustomTheme } from "@/components/common/CustomTheme";
import { EntityDataProvider } from "@/providers/EntityDataProvider";

interface ThemeProps {
  color: string
  id: string
}

const Theme: FC<ThemeProps> = memo(({ id, color }) => {
  return (
    <CustomTheme color={color} id={id}>
      <Content />
    </CustomTheme>
  )
})

export const EntityNode: FC<NodeProps<EntityNodeType>> = ({ data, id }) => {
  return (
    <EntityDataProvider data={data}>
      <Theme color={data.color} id={id} />
    </EntityDataProvider>
  )
}
