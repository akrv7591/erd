import {Stack} from "@mantine/core";
import {EntityList} from "./EntityList";
import {MiniMapController} from "./MiniMapController";
import {EntityViewController} from "./EntityViewController";
import {MemoController} from "./MemoController";
import classes from "./style.module.css"
import { memo } from "react";

export const Aside = memo(() => {
  console.log("RENDERING ASIDE")
  return (
    <Stack className={classes.root}>
      <EntityList/>
      <EntityViewController />
      <MemoController />
      <MiniMapController />
    </Stack>
  )
})
