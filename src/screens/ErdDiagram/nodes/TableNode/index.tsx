import {Box, Card, Collapse, MantineProvider} from "@mantine/core";
import {NodeProps} from "reactflow";
import styles from "./style.module.css"
import React from "react";
import ContentControls from "./ContentControls";
import {useDisclosure} from "@mantine/hooks";
import {IErdNodeData} from "@/types/erd-node";
import Header from "./Header";
import Content from "./Content";
import RelationsOverlay from "./RelationsOverlay";
import {erdTableTheme} from "@/config/theme.ts";

interface Props extends NodeProps<IErdNodeData> {
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
  const theme = React.useMemo(() => erdTableTheme(props.data.color), [props.data.color])

  if (!props.data) return null

  return (
    <MantineProvider
      defaultColorScheme={"dark"}
      theme={theme}
      cssVariablesSelector={`#${props.id}`}
      getRootElement={() => document.getElementById(props.id) || undefined}
    >
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
    </MantineProvider>
  )
})

export default TableNode
