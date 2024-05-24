import {Box, Card} from "@mantine/core";
import {Handle, Position, useNodeId, useNodesData} from "@xyflow/react";
import styles from "./style.module.css"
import {memo} from "react";
import Header from "./Header";
import Content from "./Content";
import {ErdTableDataProvider} from "@/screens/Home/Main/Reactflow/nodeTypes/TableNode/DataProvider.tsx";


const TableNode = memo(() => {
  const nodeId = useNodeId()!
  const nodeData = useNodesData(nodeId)
  return (
    <div>
      <ErdTableDataProvider>
        <Box className={styles.box} id={nodeId}>
          <Card
            style={{outline: `5px solid ${nodeData?.data.color}!important`}}
            className={styles.cardSelected}
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
    </div>
  )
})

export default TableNode
