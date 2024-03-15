import {ActionIcon, Tooltip} from "@mantine/core";
import {IconMaximize, IconMinimize} from "@tabler/icons-react";
import {useFullscreen} from "@mantine/hooks";

export default function FullscreenView() {
  const {fullscreen, toggle} = useFullscreen()

  return (
    <Tooltip position={"right"} withArrow label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
      <ActionIcon h={"40px"} w={"40px"} variant={"default"} onClick={toggle}>
        {fullscreen ? <IconMinimize/> : <IconMaximize/>}
      </ActionIcon>
    </Tooltip>
  )
}
