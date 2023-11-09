import React from "react";
import {defaultStyles} from "./index";


export const Many = () => {

  return (
    <>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="many-top"
            viewBox="0 0 12 22"
            markerHeight={15}
            markerWidth={15}
            refX={6}
            refY={12}
          >
              <path d="M6 2L6.02234 12" stroke="inherit" strokeLinecap="round"/>
              <path d="M5.97772 1.05096L1.00002 12" stroke="inherit" strokeLinecap="round"/>
              <path d="M11 12L6.0223 1.05097" stroke="inherit" strokeLinecap="round"/>

          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="many-left"
            viewBox="0 0 22 12"
            markerHeight={12}
            markerWidth={15}
            refX={12}
            refY={6}
          >
              <path d="M1 6L12 5.97769" stroke="inherit" strokeLinecap="round"/>
              <path d="M1.05096 6.02232L12 11" stroke="inherit" strokeLinecap="round"/>
              <path d="M12 1L1.05097 5.9777" stroke="inherit" strokeLinecap="round"/>
          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="many-bottom"
            viewBox="0 0 12 22"
            markerHeight={15}
            markerWidth={12}
            refX={6}
            refY={0}
          >
              <path d="M6 11L5.97766 1" stroke="inherit" strokeLinecap="round"/>
              <path d="M6.02228 11.949L11 1.00001" stroke="inherit" strokeLinecap="round"/>
              <path d="M1 1L5.9777 11.949" stroke="inherit" strokeLinecap="round"/>

          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="many-right"
            viewBox="0 0 22 12"
            markerHeight={12}
            markerWidth={15}
            refX={0}
            refY={6}
          >
            <path d="M10.0822 6L0.949021 6.02231" stroke="inherit" strokeLinecap="round"/>
            <path d="M10.949 5.97768L0.949045 0.999978" stroke="inherit" strokeLinecap="round"/>
            <path d="M0.949036 11L10.949 6.0223" stroke="inherit" strokeLinecap="round"/>

          </marker>
        </defs>
      </svg>
    </>

  )
}

