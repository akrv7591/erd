import { RELATION } from "@/constants/relations.ts";
import { usePlayground } from "@/contexts/playground/PlaygroundStoreContext.ts";
import { useEntityNodeData } from "@/hooks/useEntityNodeData.ts";
import { Handle, Position, useConnection } from "@xyflow/react";
import { memo, useMemo } from "react";
import { Overlay, Text } from "@mantine/core";
import classes from "../style.module.css"

export const SourceHandle = memo(() => {
  const tool = usePlayground(state => state.tool)
  const nodeData = useEntityNodeData();
  const connection = useConnection();
  const isToolRelation = RELATION.NAME_LIST.includes(tool as any);

  const activeNodeHandle = useMemo(() => {

    if (!isToolRelation) return false
    if (!nodeData) return false

    return nodeData.data.columns.some(column => column.primary)
  }, [nodeData, tool, isToolRelation]);

  const isConnecting = !!connection.startHandle

  let className = classes.erdNodeHandle
  let label = "Drag to connect"

  if (!activeNodeHandle) {
    label = "Need at least 1 primary key to connect"
  }

  if (isToolRelation && !isConnecting) {
    className = classes.erdNodeHandleActive
  }


  return (
    <Overlay className={className}>
      <Handle
        className={classes.handle}
        position={Position.Right}
        type={'source'}
        isConnectableStart={activeNodeHandle}
      />
      <Text className={classes.handleLabel}>{label}</Text>
    </Overlay>

  )
})
