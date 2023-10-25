import {ActionIcon, Group, Tooltip} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import React from "react";
import {useTableData} from "../../../../../providers/TableDataProvider";
import {useSetAtom} from "jotai";
import {ColumnType, getColumAtom} from "../../../../../atoms/columnAtom";


export default function ContentControls() {
  const {addColumn} = useTableData()
  const add = useSetAtom(addColumn)
  const onAdd = (type: ColumnType) => add(getColumAtom(type))

  return (
    <Group mt={"xs"} pos={"absolute"} bottom={"-35px"}>
      <ActionIcon.Group>
        <ActionIcon color={"#ffcc00"} onClick={() => onAdd("primary")}>
          <Tooltip label={"Add primary row"} position={"bottom"}>
            <IconPlus stroke={1} color={"black"}/>
          </Tooltip>
        </ActionIcon>
        <ActionIcon color={"blue"} onClick={() => onAdd("default")}>
          <Tooltip label={"Add non primary key row"} position={"bottom"}>
            <IconPlus stroke={1} color={"white"}/>
          </Tooltip>
        </ActionIcon>
      </ActionIcon.Group>
    </Group>
  )
}
