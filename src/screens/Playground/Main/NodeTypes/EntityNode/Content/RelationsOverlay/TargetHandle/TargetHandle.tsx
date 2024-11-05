import { RELATION } from "@/namespaces";
import {Handle, Position, useConnection} from "@xyflow/react";
import { memo, useMemo } from "react";
import { Overlay, Text } from "@mantine/core";
import classes from "../style.module.css"
import {useDiagramStore} from "@/hooks";
import {useEntityNode} from "@/hooks";

export const TargetHandle = memo(() => {
  const tool = useDiagramStore(state => state.tool)
  const {data, id} = useEntityNode()
  const connection = useConnection();
  const isToolRelation = RELATION.NAME_LIST.includes(tool as any);
  const activeNodeHandle = useMemo(() => {
    if (!isToolRelation) return false
    if (tool !== RELATION.NAME.MANY_TO_MANY) return true

    return data.columns.some(column => column.primary)

  }, [data.columns, tool, isToolRelation]);

  const isConnecting = !!connection.fromHandle
  const isSource = connection.fromHandle?.nodeId === id

  let className = classes.erdNodeHandle
  let label = "Drop here to connect"


  if (isConnecting) {

    const endNodeId = connection.toHandle?.nodeId
    const startNodeId = connection.toHandle?.nodeId

    if (isSource) {
      label = data.name || "Source"
    }

    if (tool === RELATION.NAME.MANY_TO_MANY && !activeNodeHandle) {
      label = "Need at least 1 primary key to connect"
    } else {
      if (startNodeId !== endNodeId && endNodeId === id) {
        label = data.name || "Source"
      }
    }

    className = classes.erdNodeHandleActive
  }

  return (
    <Overlay className={className}>
      <Handle
        className={classes.handle}
        position={Position.Right}
        type={"target"}
        isConnectableEnd={activeNodeHandle}
      >
      </Handle>
      <Text className={classes.handleLabel}>{label}</Text>
    </Overlay>
  )
})
