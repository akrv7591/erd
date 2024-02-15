import {
  RELATIONSHIP_MARKER_DEFAULT_STYLES,
  RELATIONSHIP_MARKER_DIRECTIONS,
  RELATIONSHIP_MARKER_STROKE,
  RELATIONSHIP_MARKER_STROKE_HIGHLIGHT
} from "@/screens/Playground/Main/Icons/constants.ts";

export const Many = () => {
  return RELATIONSHIP_MARKER_DIRECTIONS.map(direction => (
    <>
      <svg style={RELATIONSHIP_MARKER_DEFAULT_STYLES}>
        <defs>
          <marker
            id={`many-${direction}`}
            markerWidth="12"
            markerHeight="12"
            orient="auto"
            markerUnits={"strokeWidth"}
            refX="12"
            refY="6"
            stroke={RELATIONSHIP_MARKER_STROKE}
          >
            <path d="M1 6.02234L11 11" stroke="inherit" strokeLinecap="round"/>
            <path d="M11 1.00002L1.00001 5.97771" stroke="inherit" strokeLinecap="round"/>
          </marker>
        </defs>
      </svg>
      <svg style={RELATIONSHIP_MARKER_DEFAULT_STYLES}>
        <defs>
          <marker
            id={`many-${direction}-highlight`}
            markerWidth="12"
            markerHeight="12"
            orient="auto"
            markerUnits={"strokeWidth"}
            refX="12"
            refY="6"
            stroke={RELATIONSHIP_MARKER_STROKE_HIGHLIGHT}
          >
            <path d="M1 6.02234L11 11" stroke="inherit" strokeLinecap="round"/>
            <path d="M11 1.00002L1.00001 5.97771" stroke="inherit" strokeLinecap="round"/>
          </marker>
        </defs>
      </svg>
    </>
  ))
}

