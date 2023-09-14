import {OneToOne} from "./OneToOne";
import {Many} from "./Many";
import React from "react";

export const defaultStyles: React.CSSProperties = {position: 'absolute', top: 0, left: 0, stroke: "var(--mantine-color-text)", strokeWidth: 1}

const Icons = () => {
  return (
    <>
      <OneToOne />
      <Many />
    </>
  )
}

export default Icons
