import {memo} from "react";
import { Handles } from "./Handles";
import classes from "./style.module.css"
import {useDiagramStore} from "@/hooks";
import {RELATION} from "@/namespaces";

export const RelationsOverlay = memo(() => {
  const tool = useDiagramStore(state => state.tool)
  const isToolRelation = RELATION.NAME_LIST.includes(tool as any);

  return (
    <div className={isToolRelation ? classes.activeContainer : classes.defaultContainer}>
      <Handles/>
    </div>
  )
})
