import { RELATION } from "@/namespaces";
import { Handle, Position, useConnection } from "@xyflow/react";
import { memo, useMemo } from "react";
import { Overlay, Text } from "@mantine/core";
import classes from "../style.module.css"
import {useDiagramStore} from "@/hooks";
import { useEntityNode } from "@/hooks";

export const SourceHandle = memo(() => {
  const tool = useDiagramStore(state => state.tool)
  const {data} = useEntityNode()
  const connection = useConnection();
  const isToolRelation = RELATION.NAME_LIST.includes(tool as any);

  const activeNodeHandle = useMemo(() => {

    if (!isToolRelation) return false

    return data.columns.some(column => column.primary)
  }, [data.columns, tool, isToolRelation]);

  const isConnecting = !!connection.fromHandle

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
