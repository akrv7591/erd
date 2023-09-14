import React from "react";
import {useNodeId, useReactFlow} from "reactflow";
import {useTableData} from "../../../../../providers/TableDataProvider";
import {useAtom} from "jotai/index";
import {ActionIcon, Button, Collapse, ColorPicker, Group, Menu, TextInput, Tooltip} from "@mantine/core";
import {IconCheck, IconColorPicker, IconPencil, IconTable, IconTrash} from "@tabler/icons-react";
import ButtonWithConfirm from "../../../../../components/common/ButtonWithConfirm";

const Header = () => {
  const [allowEdit, setAllowEdit] = React.useState(false)
  const reactFlow = useReactFlow()
  const id = useNodeId() as string
  const node = reactFlow.getNode(id)
  const toggleAllowEdit = () => setAllowEdit(cur => !cur)
  const onDelete = () => reactFlow.deleteElements({nodes: [{id}]})
  const {dataAtom} = useTableData()
  const [data, setData] = useAtom(dataAtom)
  if (!node) return null
  return (
    <Group gap={5} h={50} align={"center"}>
      <IconTable stroke={1} size={35}/>
      <form onSubmit={toggleAllowEdit}>
        {allowEdit
          ?
          <TextInput
            defaultValue={data.tableName}
            placeholder={"Table name"}
            autoFocus
            variant={"unstyled"}
            rightSection={<Tooltip label={"Save"}>
              <ActionIcon type={"submit"} onClick={toggleAllowEdit}>
                <IconCheck stroke={1} size={20}/>
              </ActionIcon>
            </Tooltip>}
            error={!data.tableName}
            onChange={e => setData((cur) => ({
              ...cur,
              tableName: e.target.value
            }))}
          />

          : <Tooltip label={"Edit"}>
            <Button
              miw={200}
              color={"var(--matine-color-text)"}
              variant={"default"}
              justify={"space-between"}
              rightSection={<IconPencil stroke={1} size={20}/>} onClick={toggleAllowEdit}
            >
              {data.tableName}
            </Button>
          </Tooltip>
        }

      </form>
      <Menu>
        <Menu.Target>
          <IconColorPicker/>
        </Menu.Target>
        <Menu.Dropdown>
          <ColorPicker
            onChange={color => setData(cur => ({...cur, color}))}
            swatchesPerRow={8}
            format="hex"
            swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}/>
        </Menu.Dropdown>
      </Menu>

      <ButtonWithConfirm
        target={(
          <Collapse in={node.selected!} ml={"auto"}>
            <Tooltip label={"Delete table"}>
              <ActionIcon color={"var(--mantine-color-red-6)"}>
                <IconTrash stroke={1}/>
              </ActionIcon>
            </Tooltip>
          </Collapse>
        )}
        message={`Do you want to delete ${data.tableName} table`}
        onConfirm={onDelete}
      />

    </Group>
  )
}


export default Header
