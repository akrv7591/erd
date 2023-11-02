import {ActionIcon, Group, Tooltip} from "@mantine/core";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import React from "react";
import ButtonWithConfirm from "../../../../../components/common/ButtonWithConfirm";
import {useErdTableData} from "../../../../../providers/ErdTableDataProvider";
import {DEFAULT_COLUMN_DATA} from "../../../../../constants/erd/column";
import {IErdNodeColumn} from "../../../../../types/erd-node";
import {v4} from "uuid";
import {useNodeId, useReactFlow} from "reactflow";


export default function ContentControls() {
  const {data, setData} = useErdTableData()
  const nodeId = useNodeId() as string
  const {deleteElements} = useReactFlow()
  const onAdd = (type: "primary" | "default") => {
    const newColumn: IErdNodeColumn = {...DEFAULT_COLUMN_DATA}
    newColumn.id = v4()
    if (type === "primary") {
      newColumn.primary = true;
      newColumn.unique = true;
      newColumn.notNull = true;
    }

    setData(curData => ({
      ...curData,
      columns: [...curData.columns, newColumn]
    }))
  }

  const onDelete = () => deleteElements({nodes: [{id: nodeId}]})

  return (
    <Group mt={"xs"} pos={"absolute"} top={"0px"} bg={"red"} w={"100%"}>
      <Group mt={"-65px"} justify={"space-between"} w={"100%"}>
        <ActionIcon.Group>
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
