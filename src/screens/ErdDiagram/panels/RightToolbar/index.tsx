import {Panel} from "reactflow";
import {Stack} from "@mantine/core";
import TableList from "./TableList";

export default function RightToolbar() {
  return (
    <Panel position={"top-right"} style={{right: "-15px", top: "-15px", width: "50px", borderLeft: "1px solid var(--mantine-color-dark-4)"}}>
      <Stack h={"calc(100vh - 100px)"} bg={"dark.7"}>
        <TableList/>
      </Stack>
    </Panel>
  )
}
