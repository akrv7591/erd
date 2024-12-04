import {EdgeProps} from "@xyflow/react";
import {memo} from "react";
import "./style.css";
import {Path} from "@/screens/Diagram/Main/EdgeTypes/SmartEdge/Path";
import { useDiagramStore } from "@/hooks";
import { EdgeType } from "@/types/diagram/edge";

export const SmartEdge = memo((props: EdgeProps<EdgeType>) => {
  const nodes = useDiagramStore(state => state.nodes)

  const sourceNode = nodes.find(node => node.id === props.source)
  const targetNode = nodes.find(node => node.id === props.target)

  if (!sourceNode || !targetNode) {
    return null;
  }


  if (!sourceNode.measured || !targetNode.measured) {
    return null;
  }

  if (sourceNode?.dragging || targetNode?.dragging) {
    return null;
  }

  return (
    <Path nodes={nodes} targetNode={targetNode} sourceNode={sourceNode} edgeProps={props}/>
  );
});
