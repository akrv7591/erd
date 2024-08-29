import {memo, useCallback} from "react";
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
  TextInput
} from "@mantine/core";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {DefaultEntityConfig} from "@/stores/shared-diagram-store/stores/erdStore.ts";
import {useForm} from "@mantine/form";
import {IconExclamationCircle, IconPalette, IconRowInsertTop, IconTable} from "@tabler/icons-react";
import {EntityConfigTable} from "@/screens/Playground/Header/EntityConfig/EntityConfigModal/EntityConfigTable.tsx";
import {EntityColumn} from "@/providers/shared-diagram-store-provider/type.ts";
import {createId} from "@paralleldrive/cuid2";
import {DEFAULT_COLUMN_DATA} from "@/constants/erd/column.ts";

interface Props extends ModalProps {
  configData: DefaultEntityConfig
}

export const EntityConfigModal = memo(({configData,...modalProps}: Props) => {
  const user = useAuthStore(state => state.user)
  const setDefaultConfig = useSharedDiagramStore(state => state.setEntityConfig)
  const form = useForm<DefaultEntityConfig>({
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

  const handleAddColumn = useCallback((type: "primary" | "normal") => () => {
    const order = Object.keys(form.values.columns).length
    const id = createId()

    const column: EntityColumn = {
      ...DEFAULT_COLUMN_DATA,
      id,
      order,
      entityId: "",
      ...type==="primary" && {
        primary: true,
        notNull: true,
        unique: true
      }
    }

    form.setValues(state => {
      return {
        ...state,
        columns: [
          ...state.columns || [],
          column
        ]
      }
    })
  }, [])

  const handleClose = () => {
    setDefaultConfig(user.id, form.values)
    modalProps.onClose()
  }

  return (
    <Modal {...modalProps} style={{overflow: "visible", border: "1px solid #333"}} onClose={handleClose}>
      <Modal.Body style={{overflow: "visible"}}>
        <Stack>
          <Group>
            <IconExclamationCircle />
            <Text>It is default entity configuration. When you create new entity you get same entity</Text>
          </Group>
          <Paper bg={"var(--mantine-color-dark-6)"} p={"sm"} withBorder style={{borderColor: form.values.color}}>
            <Stack>
              <Group gap={5}>
                <TextInput
                  {...form.getInputProps("name")}
                  leftSection={(
                    <IconTable />
                  )}
                />
                <ActionIcon size={"lg"} onClick={handleAddColumn("primary")}>
                  <IconRowInsertTop color={"var(--mantine-color-yellow-5)"}/>
                </ActionIcon>
                <ActionIcon size={"lg"} onClick={handleAddColumn("normal")}>
                  <IconRowInsertTop />
                </ActionIcon>
                <Box ml={"auto"}/>
                <HoverCard closeDelay={50} withinPortal={false}>
                  <HoverCard.Target>
                    <ActionIcon variant={"subtle"} size={"lg"} ml={"auto"} color={form.values.color}>
                      <IconPalette/>
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <ColorPicker
                      value={form.values.color}
                      onChange={color => form.setFieldValue("color", color)}
                      swatchesPerRow={8}
                      format="hex"
                      swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}/>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
              <EntityConfigTable columns={form.values.columns} patchColumn={handleColumnChange}/>
            </Stack>
          </Paper>
        </Stack>
      </Modal.Body>
    </Modal>
  )
})
