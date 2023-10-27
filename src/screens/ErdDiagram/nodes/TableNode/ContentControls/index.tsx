import {ActionIcon, Group, Tooltip} from "@mantine/core";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import React from "react";
import {useTableData} from "../../../../../providers/TableDataProvider";
import {useAtomValue, useSetAtom} from "jotai";
import {ColumnType, getColumAtom} from "../../../../../atoms/columnAtom";
import ButtonWithConfirm from "../../../../../components/common/ButtonWithConfirm";
import {useNodeId, useReactFlow} from "reactflow";


export default function ContentControls() {
  const {addColumn} = useTableData()
  const add = useSetAtom(addColumn)
  const onAdd = (type: ColumnType) => add(getColumAtom(type))
  const reactFlow = useReactFlow()
  const id = useNodeId() as string
  const onDelete = () => reactFlow.deleteElements({nodes: [{id}]})
  const {dataAtom} = useTableData()
  const data = useAtomValue(dataAtom)

  return (
    <Group mt={"xs"} pos={"absolute"} top={"0px"} bg={"red"} w={"100%"}>
      <Group mt={"-65px"} justify={"space-between"} w={"100%"}>
        <ActionIcon.Group >
          <ActionIcon color={"#ffcc00"} variant={"filled"} onClick={() => onAdd("primary")}>
            <Tooltip label={"Add primary row"} position={"bottom"}>
              <IconPlus stroke={1} color={"black"}/>
            </Tooltip>
          </ActionIcon>
          <ActionIcon color={"blue"} variant={"filled"} onClick={() => onAdd("default")}>
            <Tooltip label={"Add non primary key row"} position={"bottom"}>
              <IconPlus stroke={1} color={"white"}/>
            </Tooltip>
          </ActionIcon>
        </ActionIcon.Group>
        <ButtonWithConfirm
          target={(
            <Tooltip label={"Delete table"}>
              <ActionIcon color={"var(--mantine-color-red-6)"} variant={"filled"}>
                <IconTrash stroke={1}/>
              </ActionIcon>
            </Tooltip>
          )}
          message={`Do you want to delete ${data.tableName} table`}
          onConfirm={onDelete}
        />
      </Group>
    </Group>
  )
}
