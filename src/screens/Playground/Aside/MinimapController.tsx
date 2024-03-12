import {IconEye, IconEyeOff} from "@tabler/icons-react";
import {ActionIcon, Tooltip} from "@mantine/core";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

export default function MinimapController() {
  const minimap = usePlaygroundStore(state => state.minimap)
  const setMinimap = usePlaygroundStore(state => state.setMinimap)
  return (
    <Tooltip label={minimap? "Hide minimap": "Show minimap"} position={"left"} withArrow>
      <ActionIcon
        m={"5px"}
        mt={"auto"}
        w={"40px"}
        h={"40px"}
        variant={"default"}
        onClick={() => setMinimap(!minimap)}
      >
        {minimap? <IconEyeOff/>: <IconEye />}
      </ActionIcon>
    </Tooltip>
  )
}
