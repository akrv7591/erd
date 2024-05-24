import {Box} from "@mantine/core";
import classes from "./style.module.css";
import {Helmet} from "react-helmet-async";
import {Background, BackgroundVariant, ReactFlow} from "@xyflow/react";
import data from "./data.json";
import {nodeTypes} from "@/screens/Home/Main/Reactflow/nodeTypes";
import ScrollSpy from "react-ui-scrollspy";
import {defaultEdgeOptions, edgeTypes} from "@/screens/Playground/Main/edges";
import Icons from "@/screens/Playground/Main/Icons";
import HeroNode from "@/screens/Home/Main/HeroNode";

export default function Main() {
  console.log("RENDERING")
  return (
    <ScrollSpy activeClass={"activeScroll"} scrollThrottle={60} useBoxMethod={false}>
      <Box className={classes.box} id="first_look">
        <Helmet>
          <title>Your One-Stop Solution for Entity Relation Diagram</title>
        </Helmet>
        <HeroNode/>

        <Box className={classes.flow} visibleFrom={"md"} >
          <ReactFlow
            defaultNodes={data.nodes}
            defaultEdges={data.edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            minZoom={0.5}
            maxZoom={0.5}
            preventScrolling={false}
            fitView
          >
            <Icons/>
            <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
          </ReactFlow>
        </Box>
      </Box>
    </ScrollSpy>
  );
}


