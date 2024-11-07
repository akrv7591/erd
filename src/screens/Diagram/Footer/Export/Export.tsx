import {Button, Group, Popover, Stack, Text, Textarea, Tooltip} from "@mantine/core";
import {IconDatabaseExport} from "@tabler/icons-react";

export const Export = () => {
  return (
    <Popover
      width={"100%"}
      position="top"
      offset={15}
      withArrow
      styles={{}}
      arrowSize={20}
    >
      <Popover.Target>
        <Tooltip label={"Not implemented yet"} position={"top"} withArrow>
          <Button disabled h={"40px"} size={"xs"} variant={"default"} leftSection={<IconDatabaseExport stroke={1} size={20}/>}>
            Export
          </Button>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Group>
            <Text size="xs">
              Import MySql
            </Text>
          </Group>
          <Textarea rows={10}/>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
