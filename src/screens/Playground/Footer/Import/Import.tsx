import {Button, CloseButton, Group, Popover, Select, Stack, Textarea, Title, Tooltip} from "@mantine/core";
import {IconDatabaseImport} from "@tabler/icons-react";
import React from "react";
import {useDisclosure} from "@mantine/hooks";
import {ImportSelectOptions} from "@/screens/Playground/Footer/Import/constants.ts";



export const Import = () => {
  // const [_, setImportedTables] = React.useState([])
  const [opened, {close, toggle}] = useDisclosure(false)

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    console.log(e.target.value)
    // const parser = new MysqlParser(e.target.value)
    // const tables = parser.parse()
    // setImportedTables(tables)
    // console.log(tables)
  }

  return (
    <Popover
      width={"50%"}
      position="top-start"
      offset={15}
      withArrow
      opened={opened}
      closeOnEscape={false}
    >
      <Popover.Target>
        <Tooltip label={"Not implemented yet"} position={"top"} withArrow>
          <Button disabled size={"xs"} h={"40px"} variant={"default"} leftSection={<IconDatabaseImport stroke={1} size={20}/>} onClick={toggle}>
            Import
          </Button>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <form>
          <Stack>
            <Group>
              <Title order={4}>
                Import
              </Title>
              <Select
                placeholder={"Select db"}
                data={ImportSelectOptions}
                defaultValue={'MySQL'}
              />
              <CloseButton ml={'auto'} onClick={close}/>
            </Group>
            <Textarea
              rows={10}
              onChange={onChange}
              onPaste={onChange as any}
            />
          </Stack>
        </form>
      </Popover.Dropdown>
    </Popover>
  )
}
