import {Box, Text} from "@mantine/core";
import classes from "./style.module.css";
import {Helmet} from "react-helmet-async";
import ReactFlow, {applyNodeChanges, Background, BackgroundVariant, Node} from "reactflow";
import data from "./data.json";
import {nodeTypes} from "./Reactflow/nodeTypes";
import {defaultEdgeOptions, edgeTypes} from "./Reactflow/edgesTypes";
import Icons from "@/screens/Home/Reactflow/Icons";
import React from "react";

export default function Home() {
  const [nodes, setNodes] = React.useState<Node[]>(data.nodes)

  return (
    <>
      <Box className={classes.box}>
        <Helmet>
          <title>Your One-Stop Solution for Entity Relation Diagram</title>
        </Helmet>

        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultNodes={nodes}
          defaultEdges={data.edges}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={changedNodes => {
            setNodes(applyNodeChanges(changedNodes, nodes))
          }}
          minZoom={0.5}
          maxZoom={0.5}
          fitView
          preventScrolling={false}
          onPaneScroll={e => e?.preventDefault()}
        >
          <Icons/>
          <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>

        </ReactFlow>
      </Box>
      <Box h={"1000px"} bg={"red"}>
        <Text>Test</Text>
      </Box>
    </>


  );
}


