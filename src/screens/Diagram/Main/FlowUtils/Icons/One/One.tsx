import {
  RELATIONSHIP_MARKER_DEFAULT_STYLES,
  RELATIONSHIP_MARKER_STROKE, RELATIONSHIP_MARKER_STROKE_SELECTED
} from "@/screens/Diagram/Main/FlowUtils/Icons/constants";
import {memo} from "react";

export const One = memo(() => {
  return (
    <>
      <svg style={RELATIONSHIP_MARKER_DEFAULT_STYLES}>
        <defs>
          <marker
            id={'one'}
            className={"relation-marker"}
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
      <svg style={RELATIONSHIP_MARKER_DEFAULT_STYLES}>
        <defs>
          <marker
            id={'one-selected'}
            className={"relation-marker"}
            markerWidth="12"
            markerHeight="12"
            orient="auto-start-reverse"
            markerUnits={"strokeWidth"}
            refX="10"
            refY="5"
            stroke={RELATIONSHIP_MARKER_STROKE_SELECTED}
          >
            <line x1="0.5" y1="10" x2="0.5" stroke="inherit"/>
          </marker>
        </defs>
      </svg>
    </>
  )
})
