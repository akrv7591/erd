import {EdgeProps, useInternalNode} from "@xyflow/react";
import {memo} from "react";
import "./style.css";
import {Path} from "@/screens/Diagram/Main/EdgeTypes/SmartEdge/Path";

export const SmartEdge = memo((props: EdgeProps) => {
  const targetNode = useInternalNode(props.target);
  const sourceNode = useInternalNode(props.source);

  if (!sourceNode || !targetNode) {
    return null;
  }

  if (sourceNode?.dragging || targetNode?.dragging) {
    return null;
  }

  return (
    <Path targetNode={targetNode} sourceNode={sourceNode} edgeProps={props}/>
  );
});
