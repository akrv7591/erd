import {memo, useEffect, useMemo, useState} from "react";
import {useWorkerFunc} from "use-react-workers";
import generateSmartPath from "@/utility/diagram/workers/generateSmartPath";
import {RELATION} from "@/namespaces";
import {BaseEdge, EdgeProps, Node, useReactFlow} from "@xyflow/react";
import {getEdgeParams} from "@/screens/Diagram/Main/utils";

const workerOptions = {
  remoteDependencies: [
    `https://cdn.jsdelivr.net/npm/pathfinding@0.4.18/visual/lib/pathfinding-browser.min.js`
  ]
}

const getMarkerEnd = (
  markerEnd: string,
  selected: boolean | undefined,
  end: boolean,
) => {
  const parenthesisStart = markerEnd.indexOf("#");
  const parenthesisEnd = markerEnd.indexOf(")");
  const tool = markerEnd.slice(parenthesisStart + 1, parenthesisEnd - 1);

  let relation = "";
  switch (tool) {
    case RELATION.NAME.ONE_TO_ONE:
      relation = RELATION.TYPE.ONE;
      break;
    case RELATION.NAME.ONE_TO_MANY:
      relation = end ? RELATION.TYPE.MANY : RELATION.TYPE.ONE;
      break;
    case RELATION.NAME.MANY_TO_MANY:
      relation = RELATION.TYPE.MANY;
  }

  return `url(#${relation}${selected ? "-selected" : ""})`;
};


interface Props {
  sourceNode: Node,
  targetNode: Node,
  edgeProps: EdgeProps
}

export const Path = memo(({sourceNode, targetNode, edgeProps}: Props) => {
  const [sortWorker, controller] = useWorkerFunc(generateSmartPath, workerOptions);
  const [path, setPath] = useState("");
  const reactflow = useReactFlow()

  useEffect(() => {
    const params = getEdgeParams(sourceNode, targetNode)
    sortWorker({
      sourceX: params.sx,
      sourceY: params.sy,
      sourcePosition: params.sourcePos,
      targetPosition: params.targetPos,
      targetX: params.tx,
      targetY: params.ty,
      nodes: reactflow.getNodes(),
    }).then((result) => {
      if (result) {
        setPath(result.svgPathString);
      }
    });

    return () => {
      controller.terminate()
    }
  }, [sourceNode, targetNode])

  const [markerEnd, markerStart] = useMemo(() => {
    return [
      getMarkerEnd(edgeProps.markerEnd || "", edgeProps.selected, true),
      getMarkerEnd(edgeProps.markerEnd || "", edgeProps.selected, false),
    ];
  }, []);

  return (
    <BaseEdge
      {...edgeProps}
      path={path}
      markerStart={markerStart}
      markerEnd={markerEnd}
      className={"react-flow__edge-path"}
    />
  )
})
