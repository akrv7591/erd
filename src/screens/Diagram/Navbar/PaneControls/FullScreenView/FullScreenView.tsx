import {Tooltip} from "@mantine/core";
import {IconMaximize, IconMinimize} from "@tabler/icons-react";
import {useFullscreen} from "@mantine/hooks";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";

export const FullScreenView = () => {
  const {fullscreen, toggle} = useFullscreen()

  return (
    <Tooltip position={"right"} withArrow label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
      <PlaygroundActionIcon onClick={toggle}>
        {fullscreen ? <IconMinimize/> : <IconMaximize/>}
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
