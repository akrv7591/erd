import {Title as MantineTitle} from "@mantine/core";
import classes from "./style.module.css";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";


export const Title = () => {
  const name = useSharedDiagramStore(state => state.erd.name)
  return (
    <div className={classes.titleWrapper}>
      <MantineTitle order={4} className={classes.title} fw={"normal"}>
        {name}
      </MantineTitle>
    </div>
  )
}
