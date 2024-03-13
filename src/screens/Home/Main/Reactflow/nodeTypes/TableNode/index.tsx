import {Box, Card} from "@mantine/core";
import {Handle, NodeProps, Position} from "@xyflow/react";
import styles from "./style.module.css"
import React from "react";
import Header from "./Header";
import Content from "./Content";
import {ErdTableDataProvider} from "@/screens/Home/Main/Reactflow/nodeTypes/TableNode/DataProvider.tsx";
import {EntityNodeData} from "@/types/entity-node";

interface Props extends NodeProps<EntityNodeData> {
}

const TableNode = React.memo((props: Props) => {
  return (
    <ErdTableDataProvider data={props.data} parentHtmlId={props.id}>
      <Box className={styles.box} id={props.id}>
        <Card
          style={{outline: `5px solid ${props.data.color}!important`}}
          className={props.selected ? styles.cardSelected : styles.card}
          withBorder>
          <Header/>
          <Content/>
        </Card>
        <Handle
          position={Position.Left}
          type="target"
          style={{opacity: 0}}
        />
        <Handle
          position={Position.Left}
          type="source"
          style={{opacity: 0}}
        />
      </Box>
    </ErdTableDataProvider>
  )
})

export default TableNode
