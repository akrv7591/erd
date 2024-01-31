import {Box} from "@mantine/core";
import classes from "./style.module.css";
import {Helmet} from "react-helmet-async";
import {applyNodeChanges, Background, BackgroundVariant, Node, ReactFlow} from "@xyflow/react";
import data from "./data.json";
import {nodeTypes} from "./Reactflow/nodeTypes";
import {defaultEdgeOptions, edgeTypes} from "./Reactflow/edgesTypes";
import Icons from "@/screens/Home/Reactflow/Icons";
import React from "react";
import ScrollSpy from "react-ui-scrollspy";

export default function Home() {
  const [nodes, setNodes] = React.useState<Node[]>(data.nodes)

  return (
    <ScrollSpy activeClass={"activeScroll"} scrollThrottle={60} useBoxMethod={false}>
      <Box className={classes.box} id="first_look">
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
        >
          <Icons/>
          <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
        </ReactFlow>
      </Box>
    </ScrollSpy>

  );
}


