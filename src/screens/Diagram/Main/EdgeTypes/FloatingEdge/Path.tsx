import {memo} from "react";
import {getSmoothStepPath} from "@xyflow/react";
import {getEdgeParams} from "@/screens/Diagram/Main/utils";
import "./style.css"
import {EntityNode} from "@/types/diagram";


interface Props {
  id: string,
  markerEnd: string,
  markerStart: string,
  sourceNode: EntityNode
  targetNode: EntityNode
}

const Path = memo((props: Props) => {

  if (!props.sourceNode.measured || !props.targetNode.measured) {
    return  null
  }

  const params = getEdgeParams(props.sourceNode, props.targetNode)

  const [edgePath] = getSmoothStepPath({
    sourceX: params.sx,
    sourceY: params.sy,
    sourcePosition: params.sourcePos,
    targetPosition: params.targetPos,
    targetX: params.tx,
    targetY: params.ty,
    borderRadius: 10,
    offset: 30,
  })

  return (
    <>
      <path id={props.id} d={edgePath} markerEnd={props.markerEnd} markerStart={props.markerStart} className={"react-flow__edge-path"}/>
      {/*<path id={props.id} d={edgePath} markerEnd={props.markerEnd} markerStart={props.markerStart} className={"react-flow__edge-interaction"}/>*/}
    </>
  )
})

export default Path
