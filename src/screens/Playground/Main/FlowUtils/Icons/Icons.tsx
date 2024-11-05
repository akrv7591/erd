import {One} from "./One/One";
import {Many} from "./Many/Many";
import {memo} from "react";

export const Icons = memo(() => {
  return (
    <>
      <One/>
      <Many/>
    </>
  )
})
