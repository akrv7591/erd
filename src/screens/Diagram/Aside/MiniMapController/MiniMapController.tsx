import {Tooltip} from "@mantine/core";
import Minimap from "@/assets/svgs/minimap.svg"
import MinimapClosed from "@/assets/svgs/minimap-closed.svg"
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {useDiagramStore} from "@/hooks";
import {memo} from "react";

export const MiniMapController = memo(() => {
  const isMinimapVisible = useDiagramStore(state => state.isMinimapVisible)
  const toggleMinimapVisibility = useDiagramStore(state => state.toggleMinimapVisibility)
  return (
    <Tooltip label={isMinimapVisible? "Hide minimap": "Show minimap"} position={"left"} withArrow>
      <PlaygroundActionIcon onClick={toggleMinimapVisibility}>
        {isMinimapVisible? <img width={20} src={MinimapClosed} alt={"open-minimap"}/>: <img alt={"close-minimap"} width={20} src={Minimap} />}
      </PlaygroundActionIcon>
    </Tooltip>
  )
})
