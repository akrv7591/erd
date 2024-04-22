import {EdgeProps, getSmoothStepPath, useStore} from '@xyflow/react';
import {getEdgeParams} from '../../utils.ts';
import {RELATION} from "@/constants/relations.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {memo, useCallback} from "react";
import "./style.css"

const getMarkerEnd = (markerEnd: string, end: boolean) => {
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

  return `url(#${relation})`
}


const FloatingEdge = memo((props: EdgeProps) => {
  const setHighlightedRelation = usePlaygroundStore(state => state.setHighlightedRelation)
  const sourceNode = useStore(useCallback((store) => store.nodeLookup.get(props.source), [props.source]));
  const targetNode = useStore(useCallback((store) => store.nodeLookup.get(props.target), [props.target]));

  const handleMouseOver = useCallback(() => {
    setHighlightedRelation({
      startNodeId: props.source,
      endNodeColumnId: props.id
    })
  }, [setHighlightedRelation])

  const handleMouseOut = useCallback(() => {
    setHighlightedRelation(null)
  }, [setHighlightedRelation])


  if (!sourceNode || !targetNode) {
    return null
  }

  const params = getEdgeParams(sourceNode, targetNode)

  const edgePathResponse = getSmoothStepPath({
    sourceX: params.sx,
    sourceY: params.sy,
    sourcePosition: params.sourcePos,
    targetPosition: params.targetPos,
    targetX: params.tx,
    targetY: params.ty,
    borderRadius: 20,
  })

  const [edgePath] = edgePathResponse

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
        style={props.style}
        markerEnd={getMarkerEnd(props.markerEnd || "", true)}
        markerStart={getMarkerEnd(props.markerEnd || "", false)}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseOut}
      />
    </>

  );
})

export default FloatingEdge;
