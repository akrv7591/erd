import {EdgeProps, ReactFlowState, useStore} from '@xyflow/react';
import {RELATION} from "@/constants/relations.ts";
import {memo, useCallback, useMemo} from "react";
import Path from "@/screens/Playground/Main/edges/FloatingEdge/Path.tsx";
import "./style.css"


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

const FloatingEdge = memo((props: EdgeProps) => {

  const sourceNodeSelector = useCallback((store: ReactFlowState) => store.nodes.find(node => node.id === props.source)!, [props.source])
  const targetNodeSelector = useCallback((store: ReactFlowState) => store.nodes.find(node => node.id === props.target)!, [props.target])

  const sourceNode = useStore(sourceNodeSelector);
  const targetNode = useStore(targetNodeSelector);

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

export default FloatingEdge;
