import {Handle, Position, useConnection} from "@xyflow/react";
import classes from "../style.module.css";
import {Overlay, Text} from "@mantine/core";
import {RELATION} from "@/constants/relations.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useNodeData} from "@/hooks/useNodeData.ts";
import {FC, useMemo} from "react";


const SourceHandle: FC = () => {
  const tool = usePlaygroundStore(state => state.tool)
  const nodeData = useNodeData();
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
        className={classes.sourceHandle}
        position={Position.Right}
        type={'source'}
        isConnectableStart={activeNodeHandle}
      >
      </Handle>
      <Text className={classes.handleLabel}>{label}</Text>
    </Overlay>

  )
}

const TargetHandle: FC = () => {
  const tool = usePlaygroundStore(state => state.tool)
  const nodeData = useNodeData();
  const connection = useConnection();
  const isToolRelation = RELATION.NAME_LIST.includes(tool as any);
  const activeNodeHandle = useMemo(() => {
    if (!isToolRelation) return false
    if (!nodeData) return false
    if (tool !== RELATION.NAME.MANY_TO_MANY) return true

    return nodeData.data.columns.some(column => column.primary)

  }, [nodeData, tool, isToolRelation]);

  const isConnecting = !!connection.startHandle
  const isSource = connection.startHandle?.nodeId === nodeData?.id

  let className = classes.erdNodeHandle
  let label = "Drop here to connect"


  if (isConnecting) {

    const endNodeId = connection.endHandle?.nodeId
    const startNodeId = connection.startHandle?.nodeId

    if (isSource) {
      label = nodeData?.data.name || "Source"
    }

    if (tool === RELATION.NAME.MANY_TO_MANY && !activeNodeHandle) {
      label = "Need at least 1 primary key to connect"
    } else {
      if (startNodeId !== endNodeId && endNodeId === nodeData?.id) {
        label = nodeData?.data.name || "Source"
      }
    }

    className = classes.erdNodeHandleActive
  }

  return (
    <Overlay className={className}>
      <Handle
        className={classes.sourceHandle}
        position={Position.Right}
        type={"target"}
        isConnectableEnd={activeNodeHandle}
      >
      </Handle>
      <Text className={classes.handleLabel}>{label}</Text>
    </Overlay>
  )
}


const RelationsOverlay = () => {
  return (
    <>
      <SourceHandle/>
      <TargetHandle/>
    </>
  )
}


export default RelationsOverlay
