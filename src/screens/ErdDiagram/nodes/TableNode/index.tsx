import {Box, Card, Collapse} from "@mantine/core";
import {NodeProps, useNodeId, useReactFlow} from "reactflow";
import styles from "./style.module.css"
import React from "react";
import {useAtomValue, useSetAtom} from "jotai";
import Content from "./Content";
import ContentControls from "./ContentControls";
import {IDataAtom, TableDataProvider} from "../../../../providers/TableDataProvider";
import {dragPaneAtom} from "../../../../atoms/toolAtom";
import Header from "./Header";
import Intex from "./RelationsOverlay/intex";
import {useDisclosure} from "@mantine/hooks";

interface Props extends NodeProps<IDataAtom> {}

const TableNode = React.memo((props: Props) => {
  const setDragPane = useSetAtom(dragPaneAtom)
  const data = useAtomValue(props.data)
  const [opened, {open, close}] = useDisclosure(false)
  const reactflow = useReactFlow()

  const nodeId = useNodeId()
  const node = reactflow.getNode(nodeId!)

  const onMouseOver = () => {
    setDragPane(false)
    open()
  }

  const onMouseOut = () => {
    setDragPane(true)
    close()
  }

  const headersIn = node? (node.selected? true: opened) : opened


  return (
    <Box className={styles.box} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      <TableDataProvider dataAtom={props.data}>
        <Collapse in={headersIn}>
          <ContentControls/>
        </Collapse>
        <Card style={{backgroundColor: data.color}} className={props.selected ? styles.cardSelected : styles.card} withBorder>
          <Header/>
          <Content/>
        </Card>
        <Intex/>
      </TableDataProvider>
    </Box>
  )
})

export default TableNode
