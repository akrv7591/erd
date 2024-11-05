import {Title as MantineTitle} from "@mantine/core";
import classes from "./style.module.css";
import { useErd } from "@/hooks";

export const Title = () => {
  const {data, isLoading} = useErd()

  if (isLoading || !data) {
    return null
  }

  return (
    <div className={classes.titleWrapper}>
      <MantineTitle order={4} className={classes.title} fw={"normal"}>
        {data.name}
      </MantineTitle>
    </div>
  )
}
