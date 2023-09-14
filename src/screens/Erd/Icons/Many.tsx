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
            markerHeight={22}
            markerWidth={12}
            refX={6}
            refY={22}
          >
              <path d="M6.02234 1L6.02234 21" stroke="inherit" strokeLinecap="round"/>
              <path d="M5.97766 10.051L0.999962 21" stroke="inherit" strokeLinecap="round"/>
              <path d="M11 21L6.0223 10.051" stroke="inherit" strokeLinecap="round"/>

          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="many-left"
            viewBox="0 0 22 12"
            markerHeight={12}
            markerWidth={22}
            refX={22}
            refY={6}
          >
              <path d="M1 5.97769L21 5.97769" stroke="inherit" strokeLinecap="round"/>
              <path d="M10.051 6.02231L21 11" stroke="inherit" strokeLinecap="round"/>
              <path d="M21 1L10.051 5.9777" stroke="inherit" strokeLinecap="round"/>

          </marker>
        </defs>
      </svg>
      <svg style={defaultStyles}>
        <defs>
          <marker
            id="many-bottom"
            viewBox="0 0 12 22"
            markerHeight={22}
            markerWidth={12}
            refX={6}
            refY={0}
          >
              <path d="M5.97766 21L5.97766 0.999999" stroke="inherit" strokeLinecap="round"/>
              <path d="M6.02234 11.949L11 1.00001" stroke="inherit" strokeLinecap="round"/>
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
            markerWidth={22}
            refX={0}
            refY={6}
          >
              <path d="M21 6.02231L0.999999 6.02231" stroke="inherit" strokeLinecap="round"/>
              <path d="M11.949 5.97769L1.00001 0.999993" stroke="inherit" strokeLinecap="round"/>
              <path d="M1 11L11.949 6.0223" stroke="inherit" strokeLinecap="round"/>


          </marker>
        </defs>
      </svg>
    </>

  )
}

