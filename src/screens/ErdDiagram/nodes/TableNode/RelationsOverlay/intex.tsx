import {Handle, Position, useNodeId, useReactFlow, useStore} from "reactflow";
import styles from "../style.module.css";
import React from "react";
import {atom, useAtomValue} from "jotai";
import {toolAtom} from "../../../../../atoms/toolAtom";
import {IDataAtom, useTableData} from "../../../../../providers/TableDataProvider";
import {Center, Overlay, Title} from "@mantine/core";
import {RELATIONS} from "../../../../../constants/relations";

const sourceStyle = {zIndex: 2, backgroundColor: "rgba(4,35,54,0.4)"};
const targetStyle = {zIndex: 1, backgroundColor: "rgba(6,91,63,0.4)"}

const Index = () => {
  const tool = useAtomValue(toolAtom)
  const {dataAtom} = useTableData()
  const reactFlow = useReactFlow()
  const connectionNodeId = useStore(state => state.connectionNodeId);
  const isTherePrimaryKeyAtom = React.useMemo(() => atom((get) => {
    const columns = get(get(dataAtom).columns)
    return columns.some(columnAtom => get(columnAtom).primary)
  }), [dataAtom])
  const id = useNodeId()
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const isTherePrimaryKeyInTargetAtom = React.useMemo(() => atom(get => {

    if (!isTarget) return null
    if (!connectionNodeId) return null
    const node = reactFlow.getNode(connectionNodeId!)

    if (!node) return null

    const data = node.data as IDataAtom

    if (!data) return null

    return get(get(data).columns).some(columnAtom => get(columnAtom).primary)
  }), [reactFlow, connectionNodeId, isTarget])

  const isTherePrimaryKey = useAtomValue(isTherePrimaryKeyAtom)
  const isTherePrimaryKeyInTarget = useAtomValue(isTherePrimaryKeyInTargetAtom)
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

export default Index
