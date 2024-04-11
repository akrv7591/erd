import React, {memo} from "react";
import {useHover} from "@mantine/hooks";
import {erdEntityTheme} from "@/config/theme.ts";
import {Card, MantineProvider} from "@mantine/core";
import classes from "@/screens/Playground/Main/nodes/EntityNode/style.module.css";
import NameOverlay from "@/screens/Playground/Main/nodes/EntityNode/NameOverlay";
import ContentControls from "@/screens/Playground/Main/nodes/EntityNode/ContentControls";
import Header from "@/screens/Playground/Main/nodes/EntityNode/Header";
import Content from "@/screens/Playground/Main/nodes/EntityNode/Content";
import RelationsOverlay from "@/screens/Playground/Main/nodes/EntityNode/RelationsOverlay";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";

interface Props {
  selected: boolean
  id: string
}

const ThemedNode = memo((props: Props) => {
  const {hovered, ref} = useHover()
  const data = useEntityNodeData()!
  const headersIn = props.selected || hovered
  const theme = React.useMemo(() => erdEntityTheme(data.data.color), [data.data.color])

  return (
    <MantineProvider
      defaultColorScheme={"dark"}
      theme={theme}
      cssVariablesSelector={`#${props.id}`}
      getRootElement={() => document.getElementById(props.id) || undefined}
    >
      <div ref={ref} className={classes.box} id={props.id}>
        <NameOverlay/>
        <ContentControls in={headersIn}/>
        <Card py={"5px"} px={"10px"} className={props.selected ? classes.cardSelected : classes.card} withBorder>
          <Header/>
          <Content/>
        </Card>
        <RelationsOverlay/>
      </div>
    </MantineProvider>
  )
})

export default ThemedNode
