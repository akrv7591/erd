import {Handle, Position, useNodeId, useReactFlow, useStore} from "reactflow";
import styles from "../style.module.css";
import React from "react";
import {Center, Overlay, Title} from "@mantine/core";
import {RELATIONS} from "../../../../../constants/relations";
import {useErdDiagramStore} from "../../../../../hooks/erd/useErdDiagramStore";
import {IErdNodeData} from "../../../../../types/erd-node";
import {useErdTableData} from "../../../../../contexts/ErdTableDataContext.ts";

const sourceStyle = {zIndex: 2, backgroundColor: "rgba(4,35,54,0.4)"};
const targetStyle = {zIndex: 1, backgroundColor: "rgba(6,91,63,0.4)"}

const RelationsOverlay = () => {
  const [tool] = useErdDiagramStore(state => [state.tool])
  const {data} = useErdTableData()
  const reactFlow = useReactFlow()
  const connectionNodeId = useStore(state => state.connectionNodeId);
  const isTherePrimaryKey = React.useMemo(() => data.columns.some(column => column.primary), [data])
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
        {label}
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
