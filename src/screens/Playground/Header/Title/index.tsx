import {Title as MantineTitle} from "@mantine/core";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

export default function Title() {
  const name = usePlaygroundStore(state => state.name)

  return (
    <MantineTitle order={3} style={{textTransform: "none", borderRadius: "5px"}}>
      {name}
    </MantineTitle>
  )
}
