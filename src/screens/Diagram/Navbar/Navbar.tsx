import {Stack} from "@mantine/core";
import {EntityControls} from "./EntityControls";
import {PaneControls} from "./PaneControls";
import classes from "./style.module.css"

export const Navbar = () => {
  return (
    <Stack className={classes.root}>
      <EntityControls/>
      <PaneControls />
    </Stack>
  )
}
