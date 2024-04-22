import {
  RELATIONSHIP_MARKER_DEFAULT_STYLES,
  RELATIONSHIP_MARKER_STROKE
} from "@/screens/Playground/Main/Icons/constants.ts";
import {memo} from "react";

export const One = memo(() => {
  return (
    <svg style={RELATIONSHIP_MARKER_DEFAULT_STYLES}>
      <defs>
        <marker
          id={'one'}
          markerWidth="12"
          markerHeight="12"
          orient="auto-start-reverse"
          markerUnits={"strokeWidth"}
          refX="10"
          refY="5"
          stroke={RELATIONSHIP_MARKER_STROKE}
        >
          <line x1="0.5" y1="10" x2="0.5" stroke="inherit"/>
        </marker>
      </defs>
    </svg>
  )
})

