import {One} from "./One/One.tsx";
import {Many} from "./Many/Many.tsx";
import {memo} from "react";

export const Icons = memo(() => {
  return (
    <>
      <One/>
      <Many/>
    </>
  )
})
