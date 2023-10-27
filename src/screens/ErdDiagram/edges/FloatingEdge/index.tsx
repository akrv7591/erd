import {useCallback} from 'react';
import {EdgeProps, getSmoothStepPath, useStore} from 'reactflow';

import {getEdgeParams} from '../../utils';
import {RELATION_TYPE, RELATIONS} from "../../../../constants/relations";
import classes from "./style.module.css"

const getMarkerEnd = (markerEnd: string, addon: string, end: boolean) => {
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

  return `url(#${relation}-${addon})`
}


function FloatingEdge({id, source, target, markerEnd, style, ...rest}: EdgeProps) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const {sx, sy, tx, ty, sourcePos, targetPos} = getEdgeParams(sourceNode, targetNode);


  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });


  return (
    <>
      <path
        id={id}
        className={`react-flow__edge-path ${classes.floatingPath}`}
        d={edgePath}
        markerEnd={getMarkerEnd(markerEnd || "", targetPos, true)}
        markerStart={getMarkerEnd(markerEnd || "", sourcePos, false)}
        style={style}
        stroke={"red"}
      />
    </>

  );
}

export default FloatingEdge;
