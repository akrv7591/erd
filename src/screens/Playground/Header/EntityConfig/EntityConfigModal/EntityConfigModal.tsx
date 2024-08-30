import {memo, useCallback, useMemo} from "react";
import {
  ActionIcon,
  Box,
  ColorPicker,
  Group,
  HoverCard,
  Modal,
  ModalProps,
  Paper,
  Stack,
  Text,
  TextInput,
  Tooltip
} from "@mantine/core";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {DefaultEntityConfig} from "@/stores/shared-diagram-store/stores/erdStore.ts";
import {IconExclamationCircle, IconPalette, IconRowInsertTop, IconTable, IconTrash} from "@tabler/icons-react";
import {EntityConfigTable} from "@/screens/Playground/Header/EntityConfig/EntityConfigModal/EntityConfigTable.tsx";
import {EntityColumn} from "@/providers/shared-diagram-store-provider/type.ts";
import {COLUMN_TYPE} from "@/constants/erd/column.ts";
import {EntityUtils} from "@/utility/EntityUtils.ts";
import {
  EntityConfigFormProvider,
  useEntityConfigForm
} from "@/screens/Playground/Header/EntityConfig/EntityConfigModal/EntityContextForm.ts";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {CustomTheme} from "@/components/common/CustomTheme";

interface Props extends ModalProps {
  configData: DefaultEntityConfig
}

export const EntityConfigModal = memo(({configData, ...modalProps}: Props) => {
  const user = useAuthStore(state => state.user)
  const setDefaultConfig = useSharedDiagramStore(state => state.setEntityConfig)
  const form = useEntityConfigForm({
    initialValues: configData,
  })
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

  const handleAddColumn = useCallback((type: COLUMN_TYPE) => () => {
    form.setValues(state => {
      const order = Object.keys(form.values.columns).length
      const column = EntityUtils.generateDefaultColumn(type, "", order)
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
    setDefaultConfig(user.id, form.values)
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
    <Modal {...modalProps} onClose={handleClose} size={"auto"}>
      <EntityConfigFormProvider form={form}>
        <CustomTheme color={configData.color} id={user.id + "-entity-config"}>
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
                          <ActionIcon size={"lg"} onClick={handleAddColumn(COLUMN_TYPE.PRIMARY)}>
                            <IconRowInsertTop color={"var(--mantine-color-yellow-5)"}/>
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label={"Add default column"}>
                          <ActionIcon size={"lg"} onClick={handleAddColumn(COLUMN_TYPE.DEFAULT)}>
                            <IconRowInsertTop/>
                          </ActionIcon>
                        </Tooltip>
                      </>
                    )}
                    <Box ml={"auto"}/>
                    <HoverCard closeDelay={50} withinPortal={false}>
                      <HoverCard.Target>
                        <ActionIcon variant={"subtle"} size={"lg"} ml={"auto"} color={configData.color}>
                          <IconPalette/>
                        </ActionIcon>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <ColorPicker
                          value={form.values.color}
                          onChange={color => setDefaultConfig(user.id, {color})}
                          swatchesPerRow={8}
                          format="hex"
                          swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}/>
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
        </CustomTheme>
      </EntityConfigFormProvider>
    </Modal>
  )
})
