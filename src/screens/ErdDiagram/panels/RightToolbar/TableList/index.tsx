import {
  ActionIcon,
  Button,
  Checkbox,
  CloseButton,
  Collapse,
  Group,
  Menu,
  Stack,
  Table,
  Text,
  Tooltip
} from "@mantine/core";
import {IconList, IconTrash} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {useErdDiagramStore} from "../../../../../stores/useErdDiagramStore.ts";
import classes from "./style.module.css";
import React from "react";
import SearchInput from "../../../../../components/common/SearchInput.tsx";
import {useReactFlow} from "reactflow";
import {IErdNode} from "../../../../../types/erd-node";
import ButtonWithConfirm from "../../../../../components/common/ButtonWithConfirm";

export default function TableList() {
  const [opened, {open, close}] = useDisclosure()
  const [selectedEntities, setSelectedEntities] = React.useState<IErdNode[]>([])
  const tables = useErdDiagramStore(state => state.tables)
  const [search, setSearch] = React.useState("")
  const filteredTables = React.useMemo(() => tables.filter(t => t.data.name.toLowerCase().includes(search.toLowerCase())), [search, tables])
  const reactFlow = useReactFlow()
  const onSelectedDelete = React.useCallback(() => {
    reactFlow.deleteElements({nodes: selectedEntities})
    setSelectedEntities([])
  }, [selectedEntities, setSelectedEntities])

  return (
    <Menu
      withArrow
      arrowPosition={"center"}
      opened={opened}
      onClose={close}
      closeOnEscape={false}
      closeOnClickOutside={false}
      position={"left-start"}
      trapFocus
      offset={10}
    >
      <Menu.Target>
        <Tooltip
          color={"var(--mantine-color-dark-6)"}
          position={"left"}
          label={(<Text>Entity list</Text>)}
        >
          <ActionIcon
            onClick={() => {
              setSearch("")
              opened ? close() : open()
            }}
            m={"5px"}
            variant={opened ? 'light' : 'subtle'}
            w={"40px"}
            h={"40px"}
          >
            <IconList color={"var(--mantine-color-text)"}/>
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack className={classes.listWrapper} miw={400}>
          <Table stickyHeader highlightOnHover>
            <Table.Thead style={{zIndex: 1}}>
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <SearchInput
                    onChange={setSearch}
                    labelProps={{
                      w: "100%",
                      mb: "5px",
                    }}
                    label={(
                      <Group w={"100%"} justify={"space-between"}>
                        <Text>
                          {tables.length} Entities
                        </Text>
                        <Tooltip label={"Close"}>
                          <CloseButton onClick={close}/>
                        </Tooltip>
                      </Group>

                    )}
                    placeholder={"Search for entity name"}
                    data-autofocus
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr bg={"var(--mantine-color-dark-7)"}>
                <Table.Th></Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Columns</Table.Th>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={3} p={0}>
                  <Collapse in={selectedEntities.length > 0}>
                    <ButtonWithConfirm
                      key={selectedEntities.length}
                      isDanger
                      position={"bottom"}
                      target={(
                        <Button
                          m={10}
                          size={"xs"}
                          variant={"default"}
                          color={"var(--mantine-color-red-filled)"}
                          leftSection={<IconTrash/>}
                        >
                          Delete {selectedEntities.length} {selectedEntities.length > 1? "entities": "entity"}
                        </Button>
                      )}
                      message={`Do you really want to delete ${selectedEntities.length} entities?`}
                      onConfirm={onSelectedDelete}
                    />
                  </Collapse>
                </Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredTables.map(table => (
                <Table.Tr
                  key={table.id}
                  onClick={() => reactFlow.fitView({nodes: [table], duration: 1000})}
                  style={{
                    cursor: "pointer",
                    ...selectedEntities.includes(table) && {
                      backgroundColor: "var(--mantine-primary-color-light)"
                  }
                }}
                >
                  <Table.Td>
                    <Checkbox checked={selectedEntities.includes(table)} onClick={(e) => e.stopPropagation()} onChange={(e) => {
                      const checked = e.target.checked

                      if (checked) {
                        setSelectedEntities(cur => [...cur, table])
                      } else {
                        setSelectedEntities(cur => cur.filter(t => t.id !== table.id))
                      }
                    }} style={{zIndex: 0, position: "relative"}}/>
                  </Table.Td>
                  <Table.Td >
                    <Text>{table.data.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    {table.data.columns.length}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  )
}
