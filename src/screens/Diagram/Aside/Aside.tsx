import {Stack} from "@mantine/core";
import {EntityList} from "./EntityList";
import {MiniMapController} from "./MiniMapController";
import {EntityViewController} from "./EntityViewController";
import {MemoController} from "./MemoController";

export const Aside = () => {
  return (
    <Stack h={"100%"} gap={"5px"} py={"4px"} align={"center"}>
      <EntityList/>
      <EntityViewController />
      <MemoController />
      <MiniMapController />
    </Stack>
  )
}
