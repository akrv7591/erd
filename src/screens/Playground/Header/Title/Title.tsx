import {Title as MantineTitle} from "@mantine/core";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";
import classes from "./style.module.css";

export const Title = () => {
  const name = usePlayground(state => state.name)

  return (
    <div className={classes.titleWrapper}>
      <MantineTitle order={4} className={classes.title} fw={"normal"}>
        {name}
      </MantineTitle>
    </div>
  )
}
