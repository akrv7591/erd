import {RELATION} from "@/namespaces";
import {Handle, Position, useConnection} from "@xyflow/react";
import {memo, useMemo} from "react";
import classes from "../style.module.css"
import {useDiagramStore, useEntityNode} from "@/hooks";
import {Text} from "@mantine/core";

export const Handles = memo(() => {
  const tool = useDiagramStore(state => state.tool)
  const {data, id: nodeId} = useEntityNode()
  const connection = useConnection();
  const handleData = useMemo(() => {
    const isToolRelation = RELATION.NAME_LIST.includes(tool as any);

    const handleData = {
      label: "Need at least 1 primary key to connect",
      isConnectableStart: false
    }

    if (!isToolRelation) {
      return handleData
    }

    const isThereAnyPrimaryKeys = data.columns.some(column => column.primary)

    if (isThereAnyPrimaryKeys) {
      handleData.label = "Drag to connect"
      handleData.isConnectableStart = true
    }

    if (connection.inProgress) {

      if (connection.fromHandle.nodeId === nodeId) {
        handleData.label = data.name
      } else if (connection.toHandle?.nodeId === nodeId) {
        handleData.label = data.name
      } else {
        handleData.label = "Drop here to connect"
      }
    }

    return handleData

  }, [data.columns, tool, connection, nodeId]);

  return (
    <>
      <Handle
        className={classes.handle}
        position={Position.Right}
        type={'source'}
        style={{zIndex: connection.inProgress? 0: 1}}
        isConnectableStart={handleData.isConnectableStart}
        isConnectableEnd={false}
      />
      <Handle
        className={classes.handle}
        position={Position.Right}
        type={'target'}
        style={{zIndex: connection.inProgress? 1: 0}}
        isConnectableStart={false}
        isConnectableEnd
      />
      <Text className={classes.handleLabel}>{handleData.label}</Text>
    </>
  )
})
