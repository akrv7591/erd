import {Stack} from "@mantine/core";
import EntityControls from "@/screens/Playground/Navbar/EntityControls";
import PlaygroundPaneControls from "@/screens/Playground/Navbar/PlaygroundPaneControls";

export default function Navbar() {
  return (
    <Stack h={"100%"} w={"100%"} py={"5px"} gap={"5px"} align={"center"}>
      <EntityControls/>
      <PlaygroundPaneControls />
    </Stack>
  )
}
