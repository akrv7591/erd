import {Box, Card, Collapse} from "@mantine/core";
import {NodeProps, useReactFlow} from "reactflow";
import styles from "./style.module.css"
import React from "react";
import ContentControls from "./ContentControls";
import {useDisclosure} from "@mantine/hooks";
import {ErdTableDataProvider} from "../../../../providers/ErdTableDataProvider";
import {IErdNodeData} from "../../../../types/erd-node";
import Header from "./Header";
import Content from "./Content";
import RelationsOverlay from "./RelationsOverlay";
import {useErdDiagramStore} from "../../../../hooks/erd/useErdDiagramStore";

interface Props extends NodeProps<IErdNodeData> {
}

const TableNode = React.memo((props: Props) => {
  const setDragPane = useErdDiagramStore(state => state.setDragPane)
  const [opened, {open, close}] = useDisclosure(false)
  const reactflow = useReactFlow()
  const node = reactflow.getNode(props.id)

  const onMouseOver = () => {
    setDragPane(false)
    open()
  }

  const onMouseOut = () => {
    setDragPane(true)
    close()
  }

  const headersIn = node ? (node.selected ? true : opened) : opened


  return (
    <ErdTableDataProvider>
      <Box className={styles.box} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
        <Collapse in={headersIn}>
          <ContentControls/>
        </Collapse>
        <Card
          style={{backgroundColor: props.data.color}}
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
