import {Box, Card, Collapse} from "@mantine/core";
import {NodeProps} from "@xyflow/react";
import styles from "./style.module.css"
import React from "react";
import ContentControls from "./ContentControls";
import {useDisclosure} from "@mantine/hooks";
import Header from "./Header";
import Content from "./Content";
import RelationsOverlay from "./RelationsOverlay";
import {ErdTableDataProvider} from "@/screens/Home/Main/Reactflow/nodeTypes/TableNode/DataProvider.tsx";
import {ITableNodeData} from "@/types/table-node";

interface Props extends NodeProps<ITableNodeData> {
}

const TableNode = React.memo((props: Props) => {
  const [opened, {open, close}] = useDisclosure(false)

  const onMouseOver = () => {
    open()
  }

  const onMouseOut = () => {
    close()
  }

  const headersIn = props.selected ? true : opened

  return (
    <ErdTableDataProvider data={props.data} parentHtmlId={props.id}>
      <Box className={styles.box} onMouseOver={onMouseOver} onMouseOut={onMouseOut} id={props.id}>
        <Collapse in={headersIn}>
          <ContentControls/>
        </Collapse>
        <Card
          style={{outline: `5px solid ${props.data.color}!important`}}
          className={props.selected ? styles.cardSelected : styles.card}
          withBorder>
          <Header/>
          <Content/>
        </Card>
        <RelationsOverlay/>
      </Box>
    </ErdTableDataProvider>
  )
})

export default TableNode
