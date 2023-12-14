import {Handle, Position, useNodeId, useReactFlow, useStore} from "reactflow";
import styles from "../style.module.css";
import React from "react";
import {Center, Overlay, Text, Title} from "@mantine/core";
import {RELATIONS} from "../../../../../constants/relations";
import {useErdDiagramStore} from "../../../../../stores/useErdDiagramStore.ts";
import {IErdNodeData} from "../../../../../types/erd-node";
import {useErdTableData} from "../../../../../contexts/ErdTableDataContext.ts";

const sourceStyle = {zIndex: 2, backgroundColor: "var(--mantine-primary-color-light-hover)"};
const targetStyle = {zIndex: 1, backgroundColor: "var(--mantine-primary-color-light-hover)"}

const RelationsOverlay = () => {
  const [tool] = useErdDiagramStore(state => [state.tool])
  const {columns} = useErdTableData()
  const reactFlow = useReactFlow()
  const connectionNodeId = useStore(state => state.connectionNodeId);
  const isTherePrimaryKey = React.useMemo(() => columns.some(column => column.primary), [columns])
  const id = useNodeId()
  const isTarget = connectionNodeId && connectionNodeId !== id;
  const isTherePrimaryKeyInTarget = React.useMemo(() => {

    if (!isTarget) return null
    if (!connectionNodeId) return null
    const connectionNode = reactFlow.getNode(connectionNodeId!)

    if (!connectionNode) return null

    const connectionNodeData = connectionNode.data as IErdNodeData

    if (!connectionNodeData) return null

    return connectionNodeData.columns.some(column => column.primary)
  }, [reactFlow, connectionNodeId, isTarget])

  const isRelationConnection = ['one-to-one', 'one-to-many', 'many-to-many'].includes(tool);
  const isConnecting = !!connectionNodeId;
  const label = isTarget
    ? (tool !== RELATIONS.MANY_TO_MANY
        ? 'Drop here'
        : isTherePrimaryKeyInTarget ? "Drop here" : "Need at least 1 primary key in target"
    )
    : 'Drag to connect';

  const renderSource = () => {
    if (!isConnecting && !isTherePrimaryKey && isRelationConnection) return (
      <Overlay>
        <Center h={"100%"}>
          <Title>Need at least 1 primary key to connect</Title>
        </Center>
      </Overlay>
    )
    if (!isConnecting) return (
      <Handle
        className={styles.customHandle}
        position={Position.Right}
        type="source"
        style={isRelationConnection && isTherePrimaryKey ? sourceStyle : {}}
      >
        <Text>{label}</Text>
      </Handle>
    )
  }

  return (
    <>
      <Handle
        className={styles.customHandle}
        position={Position.Left}
        type="target"
        style={isTarget ? targetStyle : {}}
      >
        {label}
      </Handle>
      {renderSource()}
      {!isConnecting && (
        <Handle
          className={styles.customHandle}
          position={Position.Right}
          type="source"
          style={isRelationConnection && isTherePrimaryKey ? sourceStyle : {}}
        >
          {label}
        </Handle>
      )}
    </>
  )
}

export default RelationsOverlay
