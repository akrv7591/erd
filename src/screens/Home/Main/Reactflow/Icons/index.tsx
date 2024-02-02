import {One} from "./One.tsx";
import {Many} from "./Many.tsx";
import React from "react";

export const defaultStyles: React.CSSProperties = {position: 'absolute', top: 0, left: 0, stroke: "var(--mantine-color-text)", strokeWidth: 1}

const Icons = () => {
  return (
    <>
      <One />
      <Many />
    </>
  )
}

export default Icons
