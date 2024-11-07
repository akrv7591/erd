import {Stack} from "@mantine/core";
import {EntityControls} from "./EntityControls";
import {PaneControls} from "./PaneControls";

export const Navbar = () => {
  return (
    <Stack h={"100%"} w={"100%"} py={"5px"} gap={"5px"} align={"center"}>
      <EntityControls/>
      <PaneControls />
    </Stack>
  )
}
