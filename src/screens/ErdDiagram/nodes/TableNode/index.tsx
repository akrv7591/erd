import {Box, Card} from "@mantine/core";
import {NodeProps} from "reactflow";
import styles from "./style.module.css"
import React from "react";
import {useAtomValue, useSetAtom} from "jotai";
import Content from "./Content";
import ContentControls from "./ContentControls";
import {IDataAtom, TableDataProvider} from "../../../../providers/TableDataProvider";
import {dragPaneAtom} from "../../../../atoms/toolAtom";
import Header from "./Header";
import Relations from "./Relations";

interface Props extends NodeProps<IDataAtom> {}

const TableNode = React.memo((props: Props) => {
  const setDragPane = useSetAtom(dragPaneAtom)
  const data = useAtomValue(props.data)


  return (
    <Box className={styles.box} onMouseOver={() => setDragPane(false)} onMouseOut={() => setDragPane(true)}>
      <TableDataProvider dataAtom={props.data}>
        <Card style={{backgroundColor: data.color}} className={props.selected ? styles.cardSelected : styles.card} withBorder>
          <Header/>
          <Content/>
        </Card>
        <Relations/>
        <ContentControls/>
      </TableDataProvider>
    </Box>
  )
})

export default TableNode
