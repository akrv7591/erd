import {One} from "./One.tsx";
import {Many} from "./Many.tsx";
import {memo} from "react";

const Icons = memo(() => {
  return (
    <>
      <One/>
      <Many/>
    </>
  )
})

export default Icons
