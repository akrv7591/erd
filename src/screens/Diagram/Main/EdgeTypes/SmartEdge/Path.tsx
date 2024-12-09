import {memo, useEffect, useState} from "react";
import {useWorkerFunc} from "use-react-workers";
import generateSmartPath from "@/utility/diagram/workers/generateSmartPath";
import {BaseEdge, EdgeProps, Node,} from "@xyflow/react";
import {getEdgeParams} from "@/screens/Diagram/Main/utils";
import { EdgeType } from "@/types/diagram/edge";
import { useDiagramStore } from "@/hooks";

const workerOptions = {
  remoteDependencies: [
    `https://cdn.jsdelivr.net/npm/pathfinding@0.4.18/visual/lib/pathfinding-browser.min.js`
  ]
}

interface Props {
  sourceNode: Node,
  targetNode: Node,
  nodes: Node[],
  edgeProps: EdgeProps<EdgeType>
}

export const Path = memo(({sourceNode, targetNode, edgeProps, nodes}: Props) => {
  const [sortWorker, controller] = useWorkerFunc(generateSmartPath, workerOptions);
  const [path, setPath] = useState<string>("");
  const nodePositionChange = useDiagramStore(state => state.nodePositionChange)

  useEffect(() => {
    const isNodesBeingDragged = nodes.some(node => node.dragging)

    if (isNodesBeingDragged) {
      return
    }

    const params = getEdgeParams(sourceNode, targetNode)
    sortWorker({
      sourceX: params.sx,
      sourceY: params.sy,
      sourcePosition: params.sourcePos,
      targetPosition: params.targetPos,
      targetX: params.tx,
      targetY: params.ty,
      nodes,
    }).then((result) => {
      if (result?.svgPathString) {
        setPath(result.svgPathString);
      }
    });

    return () => {
      controller.terminate()
    }
  }, [nodePositionChange, sourceNode.measured, targetNode.measured])
  const isSelected = edgeProps.selected || sourceNode.selected || targetNode.selected

  const className = isSelected? edgeProps.data?.relationName + " selected" : edgeProps.data?.relationName

  return (
    <BaseEdge
      {...edgeProps}
      path={path}
      className={className}
    />
  )
})
