import {Handle, Position, useNodeId, useStore} from "reactflow";
import styles from "./style.module.css";
import React from "react";
import {useAtomValue} from "jotai/index";
import {toolAtom} from "../../../../atoms/toolAtom";
import {useTableData} from "../../../../providers/TableDataProvider";
import {atom} from "jotai";
import {Center, Overlay, Title} from "@mantine/core";

const sourceStyle = {zIndex: 2, backgroundColor: "rgba(4,35,54,0.4)"};
const targetStyle = {zIndex: 1, backgroundColor: "rgba(6,91,63,0.4)"}

const Relations = () => {
  const tool = useAtomValue(toolAtom)
  const {dataAtom} = useTableData()
  const isTherePrimaryKeyAtom = React.useMemo(() => atom((get) => {
    const columns = get(get(dataAtom).columns)
    return columns.some(columnAtom => get(columnAtom).primary)
  }), [dataAtom])
  const isTherePrimaryKey = useAtomValue(isTherePrimaryKeyAtom)
  const isRelationConnection = ['one-to-one', 'one-to-many', 'many-to-many'].includes(tool);
  const connectionNodeId = useStore(state => state.connectionNodeId);
  const id = useNodeId()
  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  const label = isTarget ? 'Drop here' : 'Drag to connect';

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

export default Relations
