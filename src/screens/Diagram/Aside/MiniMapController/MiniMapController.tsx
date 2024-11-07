import {Tooltip} from "@mantine/core";
import Minimap from "@/assets/svgs/minimap.svg"
import MinimapClosed from "@/assets/svgs/minimap-closed.svg"
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {DiagramStore} from "src/stores/diagram-store";
import {useDiagramStore} from "@/hooks";
import {useShallow} from "zustand/react/shallow";

const selector = ({minimap, setMinimap}: DiagramStore) => ({
  minimap, setMinimap
})

export const MiniMapController = () => {
  const {minimap, setMinimap} = useDiagramStore(useShallow(selector))
  const toggle = () => setMinimap(!minimap)
  return (
    <Tooltip label={minimap? "Hide minimap": "Show minimap"} position={"left"} withArrow>
      <PlaygroundActionIcon onClick={toggle}>
        {minimap? <img width={20} src={MinimapClosed} alt={"open-minimap"}/>: <img alt={"close-minimap"} width={20} src={Minimap} />}
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
