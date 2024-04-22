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
import {UsePlaygroundStore, usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import classes from "./style.module.css";
import React from "react";
import SearchInput from "@/components/common/SearchInput.tsx";
import {useReactFlow} from "@xyflow/react";
import {EntityNode} from "@/types/entity-node";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";
import {useShallow} from "zustand/react/shallow";

const selector = (state: UsePlaygroundStore) => ({
  entities: state.nodes.filter(node => node.type === NODE_TYPES.ENTITY) as EntityNode[]
})

export default function TableList() {
  const reactflow = useReactFlow()
  const [search, setSearch] = React.useState("")
  const [opened, {toggle, close}] = useDisclosure(false, {
    onClose: () => {
      setSelectedEntities([])
      setSearch("")
    }
  })

  const {entities} = usePlaygroundStore(useShallow(selector))
  const [selectedEntities, setSelectedEntities] = React.useState<EntityNode[]>([])
  const filteredEntities = React.useMemo(() => entities.filter(entity => entity.data.name.toLowerCase().includes(search.toLowerCase())), [search, entities])
  const onSelectedDelete = React.useCallback(() => {
    reactflow.deleteElements({
      nodes: selectedEntities.map(t => ({id: t.id})),
    }).then(() => setSelectedEntities([]))

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
        <Tooltip withArrow position={"left"} label={"Entity list"} hidden={opened}>
          <ActionIcon
            onClick={toggle}
            mx={"5px"}
            variant={opened ? 'light' : 'default'}
            w={"40px"}
            h={"40px"}
          >
            <IconList/>
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
                          {entities.length} Entities
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
                    <Button
                      m={10}
                      size={"xs"}
                      variant={"default"}
                      color={"var(--mantine-color-red-filled)"}
                      onClick={onSelectedDelete}
                      leftSection={<IconTrash/>}
                    >
                      Delete {selectedEntities.length} {selectedEntities.length > 1 ? "entities" : "entity"}
                    </Button>
                  </Collapse>
                </Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredEntities.map(entity => (
                <Table.Tr
                  key={entity.id}
                  onClick={() => reactflow.fitView({nodes: [entity], duration: 1000})}
                  style={{
                    cursor: "pointer",
                    ...selectedEntities.includes(entity) && {
                      backgroundColor: "var(--mantine-primary-color-light)"
                    }
                  }}
                >
                  <Table.Td>
                    <Checkbox
                      checked={selectedEntities.includes(entity)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const checked = e.target.checked

                        if (checked) {
                          setSelectedEntities(cur => [...cur, entity])
                        } else {
                          setSelectedEntities(cur => cur.filter(t => t.id !== entity.id))
                        }
                      }}
                      style={{zIndex: 0, position: "relative"}}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Text>{entity.data.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    {entity.data.columns?.length}
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
