import {Button, CloseButton, Group, Popover, Select, SelectProps, Stack, Textarea, Title} from "@mantine/core";
import {IconDatabaseImport} from "@tabler/icons-react";
import React from "react";
import {MysqlParser, Table} from "../../../../../utility/MySqlParser";
import {useDisclosure} from "@mantine/hooks";

const selectValue: SelectProps['data'] = [{
  value: "MySQL",
  label: "MySQL",
}, {
  value: "MariaDB",
  label: "MariaDB",
}, {
  value: "MongoDb",
  label: "MongoDb",
  disabled: true
}]

export default function Import() {
  const [importedTables, setImportedTables] = React.useState<Table[]>([])
  const [opened, {close, toggle}] = useDisclosure(false)

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const parser = new MysqlParser()
    const tables = parser.parse(e.target.value)
    setImportedTables(tables)

    console.log(importedTables)
  }
  return (
    <Popover
      width={"50%"}
      position="top-start"
      offset={15}
      withArrow
      opened={opened}
      styles={{}}
      arrowSize={20}
      closeOnEscape={false}
    >
      <Popover.Target>
        <Button size={"xs"} variant={"light"} leftSection={<IconDatabaseImport stroke={1} size={20}/>} onClick={toggle}>
          Import
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Group>
            <Title order={4}>
              Import
            </Title>
            <Select
              placeholder={"Select db"}
              data={selectValue}
              defaultValue={'MySQL'}
            />
            <CloseButton ml={'auto'} onClick={close}/>
          </Group>
          <Textarea onChange={onChange} rows={10}/>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
