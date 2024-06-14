import {Tooltip} from "@mantine/core";
import Minimap from "@/assets/svgs/minimap.svg"
import MinimapClosed from "@/assets/svgs/minimap-closed.svg"
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";

export const MiniMapController = () => {
  const minimap = usePlayground(state => state.minimap)
  const setMinimap = usePlayground(state => state.setMinimap)
  const toggle = () => setMinimap(!minimap)
  return (
    <Tooltip label={minimap? "Hide minimap": "Show minimap"} position={"left"} withArrow>
      <PlaygroundActionIcon onClick={toggle}>
        {minimap? <img width={20} src={MinimapClosed} alt={"open-minimap"}/>: <img alt={"close-minimap"} width={20} src={Minimap} />}
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
