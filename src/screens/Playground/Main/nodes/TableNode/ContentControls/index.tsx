import {ActionIcon, Group, Tooltip} from "@mantine/core";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {useNodeId, useReactFlow} from "@xyflow/react";
import {DEFAULT_COLUMN_DATA} from "@/constants/erd/column.ts";
import {createId} from "@paralleldrive/cuid2";
import {Column} from "@/enums/playground.ts";
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {useNodeData} from "@/hooks/useNodeData.ts";
import {ITableNodeColumn} from "@/types/table-node";


export default function ContentControls() {
  const playground = usePlayground()
  const data = useNodeData()
  const nodeId = useNodeId() as string
  const {deleteElements} = useReactFlow()
  const onDelete = () => deleteElements({nodes: [{id: nodeId}]})

  const addColumn = (type: "primary" | "default") => {
    const newColumn: ITableNodeColumn = {...DEFAULT_COLUMN_DATA, order: data.columns.length, tableId: nodeId}
    newColumn.id = createId()

    if (type === "primary") {
      newColumn.primary = true;
      newColumn.unique = true;
      newColumn.null = true;
    }
    playground.column(Column.add, newColumn)

  }

  return (
    <Group mt={"xs"} pos={"absolute"} top={"0px"} bg={"red"} w={"100%"}>
      <Group mt={"-65px"} justify={"space-between"} w={"100%"}>
        <ActionIcon.Group>
          <ActionIcon color={"#ffcc00"} variant={"filled"} onClick={() => addColumn("primary")}>
            <Tooltip label={"Add primary row"} position={"bottom"}>
              <IconPlus stroke={1} color={"black"}/>
            </Tooltip>
          </ActionIcon>
          <ActionIcon color={"blue"} variant={"filled"} onClick={() => addColumn("default")}>
            <Tooltip label={"Add non primary key row"} position={"bottom"}>
              <IconPlus stroke={1} color={"white"}/>
            </Tooltip>
          </ActionIcon>
        </ActionIcon.Group>
        <ButtonWithConfirm
          isDanger
          target={(
            <Tooltip label={"Delete table"}>
              <ActionIcon color={"var(--mantine-color-red-6)"} variant={"filled"}>
                <IconTrash stroke={1}/>
              </ActionIcon>
            </Tooltip>
          )}
          message={`Do you want to delete ${data.name} table`}
          onConfirm={onDelete}
        />
      </Group>
    </Group>
  )
}
