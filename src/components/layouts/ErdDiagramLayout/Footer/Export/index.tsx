import {Button, Group, Popover, Stack, Text, Textarea} from "@mantine/core";
import {IconDatabaseExport} from "@tabler/icons-react";
import React from "react";
import {MysqlParser, Table} from "../../../../../utility/MySqlParser";

export default function Export() {
  const [importedTables, setImportedTables] = React.useState<Table[]>([])

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const parser = new MysqlParser()
    const tables = parser.parse(e.target.value)
    setImportedTables(tables)

    console.log(importedTables)
  }
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
          <Textarea onChange={onChange} rows={10}/>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
