import {Button, Group, Popover, Stack, Text, Textarea} from "@mantine/core";
import {IconDatabaseExport} from "@tabler/icons-react";
import React from "react";

export default function Export() {
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
        <Button disabled size={"xs"} variant={"light"} leftSection={<IconDatabaseExport stroke={1} size={20}/>}>
          Export
        </Button>
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
