import {Box, Card, Collapse, MantineProvider} from "@mantine/core";
import {NodeProps} from "@xyflow/react";
import classes from "./style.module.css"
import React from "react";
import ContentControls from "./ContentControls";
import {useHover} from "@mantine/hooks";
import Header from "./Header";
import Content from "./Content";
import RelationsOverlay from "./RelationsOverlay";
import {erdTableTheme} from "@/config/theme.ts";
import {EntityNodeData} from "@/types/entity-node";
import NameOverlay from "@/screens/Playground/Main/nodes/EntityNode/NameOverlay";

interface Props extends NodeProps<EntityNodeData> {
}

const EntityNode = React.memo((props: Props) => {
  const {hovered, ref} = useHover()
  const headersIn = props.selected || hovered
  const theme = React.useMemo(() => erdTableTheme(props.data.color), [props.data.color])

  if (!props.data) return null

  return (
    <MantineProvider
      defaultColorScheme={"dark"}
      theme={theme}
      cssVariablesSelector={`#${props.id}`}
      getRootElement={() => document.getElementById(props.id) || undefined}
    >
      <Box ref={ref} className={classes.box} id={props.id}>
        <NameOverlay />
        <Collapse in={headersIn}>
          <ContentControls/>
        </Collapse>
        <Card py={"5px"} px={"10px"} className={props.selected ? classes.cardSelected : classes.card} withBorder>
          <Header/>
          <Content/>
        </Card>
        <RelationsOverlay/>
      </Box>
    </MantineProvider>
  )
})

export default EntityNode
