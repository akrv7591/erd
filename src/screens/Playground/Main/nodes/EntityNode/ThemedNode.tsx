import React, {memo} from "react";
import {erdEntityTheme} from "@/config/theme.ts";
import {Card, MantineProvider} from "@mantine/core";
import NameOverlay from "@/screens/Playground/Main/nodes/EntityNode/NameOverlay";
import Header from "@/screens/Playground/Main/nodes/EntityNode/Header";
import Content from "@/screens/Playground/Main/nodes/EntityNode/Content";
import RelationsOverlay from "@/screens/Playground/Main/nodes/EntityNode/RelationsOverlay";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";
import "./entity-style.css"

const ThemedNode = memo(() => {
  const data = useEntityNodeData()!
  const theme = React.useMemo(() => erdEntityTheme(data.data.color), [data.data.color])

  return (
    <MantineProvider
      defaultColorScheme={"dark"}
      theme={theme}
      cssVariablesSelector={`#${data.id}`}
      getRootElement={() => document.getElementById(data.id) || undefined}
    >
      <div id={data.id}>
        <NameOverlay/>
        <Card py={"5px"} px={"10px"} className={"entity-container"} withBorder>
          <Header/>
          <Content/>
        </Card>
        <RelationsOverlay/>
      </div>
    // </MantineProvider>
  )
})

export default ThemedNode
