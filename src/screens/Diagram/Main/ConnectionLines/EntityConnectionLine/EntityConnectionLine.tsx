import {FC} from "react";
import {ConnectionLineComponentProps, getStraightPath} from "@xyflow/react";

export const EntityConnectionLine: FC<ConnectionLineComponentProps> = ({ fromX, fromY, toX, toY, connectionLineStyle })  => {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    // <g>
      <path style={connectionLineStyle} fill="none" stroke={"#ffffff"} d={edgePath} />
    // </g>
  );
}
