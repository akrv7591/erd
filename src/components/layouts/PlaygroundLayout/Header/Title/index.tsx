import {Badge} from "@mantine/core";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

export default function Title() {
  const name = usePlaygroundStore(state => state.name)

  return (
    <Badge size={"lg"} variant={"default"} style={{textTransform: "none", borderRadius: "5px"}}>
      {name}
    </Badge>
  )
}
