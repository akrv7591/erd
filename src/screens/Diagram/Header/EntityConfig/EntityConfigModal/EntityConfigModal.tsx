import {memo, useCallback, useMemo} from "react";
import {
  ActionIcon,
  Box,
  ColorSwatch,
  Group,
  HoverCard,
  Modal,
  ModalProps,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Tooltip
} from "@mantine/core";
import {IconExclamationCircle, IconPalette, IconRowInsertTop, IconTable, IconTrash} from "@tabler/icons-react";
import {EntityConfigTable} from "@/screens/Diagram/Header/EntityConfig/EntityConfigModal/EntityConfigTable";
import {EntityColumn, EntityData} from "@/types/diagram";
import {EntityUtils} from "@/utility/EntityUtils";
import {EntityConfigFormProvider, useEntityConfigForm} from "./EntityContextForm";
import {ButtonWithConfirm} from "@/components/common/ButtonWithConfirm";
import {useDiagramStore} from "@/hooks";
import {DIAGRAM} from "@/namespaces";
import classes from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Header/ColorChangeInput/style.module.css";

interface Props extends ModalProps {
  configData: EntityData & { userId: string }
}

export const EntityConfigModal = memo(({configData, ...modalProps}: Props) => {
  const form = useEntityConfigForm({
    initialValues: configData,
  })
  const setEntityConfig = useDiagramStore(state => state.setConfig)

  const handleColumnChange = useCallback(<K extends keyof EntityColumn>(id: EntityColumn['id'], key: K, value: EntityColumn[K]) => {
    form.setValues(state => {
      return {
        ...state,
        columns: state.columns?.map(column => {
          if (column.id !== id) {
            return column
          } else {
            return {
              ...column,
              [key]: value
            }
          }
        })
      }
    })
  }, [])

  const handleAddColumn = useCallback((type: DIAGRAM.ENTITY.COLUMN_TYPE) => () => {
    form.setValues(state => {
      const column = EntityUtils.generateDefaultColumn(type, "")
      return {
        ...state,
        columns: [
          ...state.columns || [],
          column
        ]
      }
    })
  }, [form.values.columns])

  const handleClose = () => {
    setEntityConfig(form.values)
    modalProps.onClose()
  }

  const isColumnsSelected = useMemo(() => {
    return form.values.columns?.some(column => column.selected)
  }, [form.values.columns])

  const handleDeleteSelected = useCallback(() => {
    form.setValues(state => ({
      ...state,
      columns: state.columns?.filter(column => !column.selected)
    }))
  }, [])

  return (
    <EntityConfigFormProvider form={form}>
      <Modal {...modalProps} onClose={handleClose} size={"auto"} withinPortal={false}>
        <Modal.Body>
          <Stack>
            <Group>
              <IconExclamationCircle/>
              <Text>It is default entity configuration. When you create new entity you get same entity</Text>
            </Group>
            <Paper
              withBorder
              bg={"var(--mantine-color-dark-6)"}
              p={"sm"}
              style={{borderColor: "var(--mantine-primary-color-filled)"}}>
              <Stack>
                <Group gap={5}>
                  <TextInput
                    {...form.getInputProps("name")}
                    leftSection={(
                      <IconTable/>
                    )}
                  />
                  {isColumnsSelected ? (
                    <ButtonWithConfirm
                      isDanger
                      target={(
                        <Tooltip label={"Delete selected"}>
                          <ActionIcon size={"lg"}>
                            <IconTrash/>
                          </ActionIcon>
                        </Tooltip>
                      )}
                      message={"Are you sure you want to delete selected columns?"}
                      onConfirm={handleDeleteSelected}
                    />

                  ) : (
                    <>
                      <Tooltip label={"Add primary column"}>
                        <ActionIcon size={"lg"} onClick={handleAddColumn(DIAGRAM.ENTITY.COLUMN_TYPE.PRIMARY)}>
                          <IconRowInsertTop color={"var(--mantine-color-yellow-5)"}/>
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={"Add default column"}>
                        <ActionIcon size={"lg"} onClick={handleAddColumn(DIAGRAM.ENTITY.COLUMN_TYPE.DEFAULT)}>
                          <IconRowInsertTop/>
                        </ActionIcon>
                      </Tooltip>
                    </>
                  )}
                  <Box ml={"auto"}/>
                  <HoverCard closeDelay={50} withinPortal position={"bottom"}>
                    <HoverCard.Target>
                      <ActionIcon variant={"subtle"} size={"lg"} ml={"auto"} color={form.values.color}>
                        <IconPalette/>
                      </ActionIcon>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <SimpleGrid spacing={"5px"} cols={5} className={classes.root}>
                        {DIAGRAM.ENTITY.COLORS.map(color => (
                          <ActionIcon key={color} variant={"default"}>
                            <ColorSwatch
                              size={20}
                              radius={"xs"}
                              className={classes.color}
                              onClick={() => {
                                form.setFieldValue("color", color)
                                setEntityConfig({...form.values, color})
                              }}
                              color={color}
                            />
                          </ActionIcon>
                        ))}
                      </SimpleGrid>
                    </HoverCard.Dropdown>
                  </HoverCard>
                </Group>
                <EntityConfigTable
                  columns={form.values.columns}
                  patchColumn={handleColumnChange}
                />
              </Stack>
            </Paper>
          </Stack>
        </Modal.Body>
      </Modal>
    </EntityConfigFormProvider>
  )
})
