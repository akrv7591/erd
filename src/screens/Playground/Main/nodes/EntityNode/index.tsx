import React from "react";
import ThemedNode from "@/screens/Playground/Main/nodes/EntityNode/ThemedNode.tsx";

const EntityNode = React.memo(() => {
  console.log("NODE RENDERING")
  return (
    <ThemedNode/>
  )
})

export default EntityNode
