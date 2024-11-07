import {ActionIcon, HoverCard} from "@mantine/core"
import {IconPalette} from "@tabler/icons-react"
import {memo} from "react"
import {ColorList} from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Header/ColorChangeInput/ColorList";

export const ColorChangeInput = memo(() => {
  return (
    <HoverCard closeDelay={50} withinPortal={false}>
      <HoverCard.Target>
        <ActionIcon variant={"default"} size={"lg"} ml={"auto"}>
          <IconPalette/>
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <ColorList />
      </HoverCard.Dropdown>
    </HoverCard>
  )
})
