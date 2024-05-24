import {Paper, Title as MantineTitle} from "@mantine/core";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

export default function Title() {
  const name = usePlayground(state => state.name)

  return (
    <Paper ml={"sm"} bg={"var(--mantine-color-dark-6)"} px={"15px"} py={"5px"}>
      <MantineTitle order={4} fw={"normal"} style={{textTransform: "none", borderRadius: "5px"}}>
        {name}
      </MantineTitle>
    </Paper>
  )
}
