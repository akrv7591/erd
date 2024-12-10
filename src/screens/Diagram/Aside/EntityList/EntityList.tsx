import { Menu, Tooltip } from "@mantine/core";
import { IconList } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { memo } from "react";
import { PlaygroundActionIcon } from "@/components/common/PlaygroundActionIcon";
import { Content } from "./Content";


export const EntityList = memo(() => {
  const [opened, { toggle, close }] = useDisclosure(false)

  return (
    <Menu
      withArrow
      arrowPosition={"center"}
      opened={opened}
      onClose={close}
      closeOnEscape={false}
      closeOnClickOutside={false}
      position={"left-start"}
      offset={10}
    >
      <Menu.Target>
        <Tooltip withArrow position={"left"} label={"Entity list"} hidden={opened}>
          <PlaygroundActionIcon onClick={toggle} variant={opened ? 'light' : 'default'}>
            <IconList />
          </PlaygroundActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Content onClose={close} />
      </Menu.Dropdown>
    </Menu>
  )
})
