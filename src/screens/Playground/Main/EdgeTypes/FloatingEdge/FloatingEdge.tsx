import {EdgeProps, useInternalNode} from '@xyflow/react';
import {RELATION} from "@/namespaces";
import {memo, useMemo} from "react";
import Path from "./Path.tsx";
import "./style.css"
import {EntityNode} from "@/types/diagram";


const getMarkerEnd = (markerEnd: string, selected: boolean | undefined, end: boolean) => {
  const parenthesisStart = markerEnd.indexOf("#")
  const parenthesisEnd = markerEnd.indexOf(")")
  const tool = markerEnd.slice(parenthesisStart + 1, parenthesisEnd - 1)

  let relation = ""
  switch (tool) {
    case RELATION.NAME.ONE_TO_ONE:
      relation = RELATION.TYPE.ONE
      break
    case RELATION.NAME.ONE_TO_MANY:
      relation = end ? RELATION.TYPE.MANY : RELATION.TYPE.ONE
      break
    case RELATION.NAME.MANY_TO_MANY:
      relation = RELATION.TYPE.MANY
  }

  return `url(#${relation}${selected ? "-selected" : ""})`
}

export const FloatingEdge = memo((props: EdgeProps) => {

  const sourceNode = useInternalNode<EntityNode>(props.source);
  const targetNode = useInternalNode<EntityNode>(props.target);

  if (!sourceNode || !targetNode) {
    return null
  }

  const [markerEnd, markerStart] = useMemo(() => {
    return [
      getMarkerEnd(props.markerEnd || "", props.selected, true),
      getMarkerEnd(props.markerEnd || "", props.selected, false),
    ]
  }, [props.selected])

  return (
      <Path id={props.id} markerEnd={markerEnd} markerStart={markerStart} sourceNode={sourceNode} targetNode={targetNode}/>
  );
})
