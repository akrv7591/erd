import {EdgeProps, getSmoothStepPath, useReactFlow} from '@xyflow/react';
import {getEdgeParams} from '../../utils.ts';
import {RELATION_TYPE, RELATIONS} from "@/constants/relations.ts";
import "./style.css"
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useCallback} from "react";

const getMarkerEnd = (markerEnd: string, end: boolean) => {
  const parenthesisStart = markerEnd.indexOf("#")
  const parenthesisEnd = markerEnd.indexOf(")")
  const tool = markerEnd.slice(parenthesisStart + 1, parenthesisEnd) as RELATIONS
  let relation = ""
  switch (tool) {
    case RELATIONS.ONE_TO_ONE:
      relation = RELATION_TYPE.ONE
      break
    case RELATIONS.ONE_TO_MANY:
      relation = end ? RELATION_TYPE.MANY : RELATION_TYPE.ONE
      break
    case RELATIONS.MANY_TO_MANY:
      relation = RELATION_TYPE.MANY
  }

  return `url(#${relation})`
}


function FloatingEdge(props: EdgeProps) {
  const reactflow = useReactFlow()
  const sourceNode = reactflow.getNode(props.source)
  const targetNode = reactflow.getNode(props.target)
  const setHighlightedRelation = usePlaygroundStore(state => state.setHighlightedRelation)

  if (!sourceNode || !targetNode) {
    return null;
  }

  if (!props.markerEnd) {
    return null
  }

  const {sx, sy, tx, ty, sourcePos, targetPos} = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
    borderRadius: 20,
  });

  const handleMouseOver = useCallback(() => {
    setHighlightedRelation({
      startNodeId: props.source,
      endNodeColumnId: props.id
    })
  }, [setHighlightedRelation])

  const handleMouseOut = useCallback(() => {
    setHighlightedRelation(null)
  }, [setHighlightedRelation])


  return (
    <>
      <path
        id={props.id}
        className={'react-flow__edge-interaction'}
        strokeWidth={50}
        opacity={0}
        d={edgePath}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseOut}
      />
      <path
        id={props.id}
        className={"react-flow__edge-path"}
        d={edgePath}
        markerEnd={getMarkerEnd(props.markerEnd || "", true)}
        markerStart={getMarkerEnd(props.markerEnd || "", false)}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseOut}
      />
    </>

  );
}

export default FloatingEdge;
