import {EdgeProps, getSmoothStepPath, useReactFlow} from '@xyflow/react';
import {getEdgeParams} from '../../utils.ts';
import {RELATION_TYPE, RELATIONS} from "@/constants/relations.ts";
import "./style.css"
import {useHover} from "@mantine/hooks";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

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
  const {hovered, ref} = useHover<any>()
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

  if (ref.current) {
    if (hovered || props.selected) {
      setHighlightedRelation({
        startNodeId: props.source,
        endNodeColumnId: props.id
      })
    } else {
      setHighlightedRelation(null)
    }
  }


  return (
    <>
      <path
        ref={ref}
        id={props.id}
        className={'react-flow__edge-interaction'}
        strokeWidth={50}
        opacity={0}
        d={edgePath}
      />
      <path
        id={props.id}
        className={"react-flow__edge-path"}
        d={edgePath}
        markerEnd={getMarkerEnd(props.markerEnd || "", true)}
        markerStart={getMarkerEnd(props.markerEnd || "", false)}
      />
    </>

  );
}

export default FloatingEdge;
