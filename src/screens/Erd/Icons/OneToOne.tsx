import React from "react";
import {defaultStyles} from "./index";

export const OneToOne = () => {

  return (
    <>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="one-top"
            viewBox="0 0 10 20"
            markerHeight={20}
            markerWidth={10}
            refX={5}
            refY={30}
          >
            <line x1="5" x2="5" y2="20" stroke="inherit" strokeWidth={"inherit"}/>
            <line y1="10" x2="10" y2="10" stroke="inherit" strokeWidth={"inherit"}/>
          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="one-right"
            viewBox="0 0 20 10"
            markerHeight={10}
            markerWidth={20}
            refX={-10}
            refY={5}
          >
            <line y1="5" x2="20" y2="5" stroke="inherit" strokeWidth="inherit"/>
            <line x1="12" y1="10" x2="12" stroke="inherit" strokeWidth="inherit"/>
          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="one-bottom"
            viewBox="0 0 10 20"
            markerHeight={20}
            markerWidth={10}
            refX={5}
            refY={-10}
          >
            <line x1="5" y1="20" x2="5" stroke="inherit" strokeWidth="inherit"/>
            <line x1="10" y1="12" y2="12" stroke="inherit" strokeWidth="inherit"/>
          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="one-left"
            viewBox="0 0 20 10"
            markerHeight={10}
            markerWidth={20}
            refX={30}
            refY={5}
          >
            <line x1="20" y1="5" y2="5" stroke="inherit" strokeWidth={"inherit"}/>
            <line x1="5" x2="5" y2="10" stroke="inherit" strokeWidth={"inherit"}/>
          </marker>
        </defs>
      </svg>
    </>

  )
}

