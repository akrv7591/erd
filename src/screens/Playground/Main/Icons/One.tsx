import {defaultStyles} from "./index.tsx";

export const One = () => {

  return (
    <>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="one-top"
            viewBox="0 0 10 2"
            markerHeight={2}
            markerWidth={10}
            refX={5}
            refY={10}
          >
              <line y1="0.833336" x2="10" y2="0.833336" stroke="inherit"/>
          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="one-right"
            viewBox="0 0 2 10"
            markerHeight={10}
            markerWidth={2}
            refX={-10}
            refY={5}
          >
              <line x1="0.5" y1="10" x2="0.5" stroke="inherit"/>
          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="one-bottom"
            viewBox="0 0 10 2"
            markerHeight={2}
            markerWidth={10}
            refX={5}
            refY={-10}
          >
            <line y1="0.833336" x2="10" y2="0.833336" stroke="inherit"/>
          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="one-left"
            viewBox="0 0 2 10"
            markerHeight={10}
            markerWidth={2}
            refX={10}
            refY={5}
          >
            <line x1="0.5" y1="10" x2="0.5" stroke="inherit"/>
          </marker>
        </defs>
      </svg>
    </>

  )
}

