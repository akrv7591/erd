import {ActionIcon, Tooltip} from "@mantine/core";
import Minimap from "@/assets/svgs/minimap.svg"
import MinimapClosed from "@/assets/svgs/minimap-closed.svg"
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

export default function MinimapController() {
  const minimap = usePlayground(state => state.minimap)
  const setMinimap = usePlayground(state => state.setMinimap)
  return (
    <Tooltip label={minimap? "Hide minimap": "Show minimap"} position={"left"} withArrow>
      <ActionIcon
        mx={"5px"}
        w={"40px"}
        h={"40px"}
        variant={"default"}
        onClick={() => setMinimap(!minimap)}
      >
        {minimap? <img width={20} src={MinimapClosed} alt={"open-minimap"}/>: <img alt={"close-minimap"} width={20} src={Minimap} />}
      </ActionIcon>
    </Tooltip>
  )
}
