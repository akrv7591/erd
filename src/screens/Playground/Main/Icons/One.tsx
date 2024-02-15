import {
  RELATIONSHIP_MARKER_DEFAULT_STYLES,
  RELATIONSHIP_MARKER_DIRECTIONS,
  RELATIONSHIP_MARKER_STROKE,
  RELATIONSHIP_MARKER_STROKE_HIGHLIGHT
} from "@/screens/Playground/Main/Icons/constants.ts";
import {Fragment} from "react";

export const One = () => {
  return RELATIONSHIP_MARKER_DIRECTIONS.map(direction => (
    <Fragment key={direction}>
      <svg style={RELATIONSHIP_MARKER_DEFAULT_STYLES}>
        <defs>
          <marker
            id={`one-${direction}`}
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
            id={`one-${direction}-highlighted`}
            markerWidth="12"
            markerHeight="12"
            orient="auto-start-reverse"
            markerUnits={"strokeWidth"}
            refX="10"
            refY="5"
            stroke={RELATIONSHIP_MARKER_STROKE_HIGHLIGHT}
          >
            <line x1="0.5" y1="10" x2="0.5" stroke="inherit"/>
          </marker>
        </defs>
      </svg>
    </Fragment>
  ))
}

