import {ActionIcon, Group, Tooltip} from "@mantine/core";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {useNodeId, useReactFlow} from "@xyflow/react";
import {useErdTableData} from "@/screens/Home/Main/Reactflow/ErdTableDataContext.ts";


export default function ContentControls() {
  const {data, addColumn} = useErdTableData()
  const nodeId = useNodeId() as string
  const {deleteElements} = useReactFlow()
  const onDelete = () => deleteElements({nodes: [{id: nodeId}]})

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
          tooltip={"Delete table"}
          target={(
            <ActionIcon color={"var(--mantine-color-red-6)"} variant={"filled"}>
              <IconTrash stroke={1}/>
            </ActionIcon>
          )}
          message={`Do you want to delete ${data.name} table`}
          onConfirm={onDelete}
        />
      </Group>
    </Group>
  )
}
