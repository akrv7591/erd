import {Button, Group} from "@mantine/core";
import {IconGripHorizontal, IconTrash} from "@tabler/icons-react";
import {ActionIcon} from "@mantine/core";
import {useNodeId, useReactFlow} from "@xyflow/react";
import {useCallback} from "react";

export default function Controls() {
  const reactFlow = useReactFlow()
  const nodeId = useNodeId()

  const handleDelete = useCallback(() => {
    if (!nodeId) return

    reactFlow.deleteElements({nodes: [{id: nodeId}]})

  }, [reactFlow])
  return (
    <Group justify={"space-between"} gap={"xs"}>
      <Button bg={"var(--mantine-color-dark-4)"} size={"xs"} flex={1} variant={"default"}>
        <IconGripHorizontal />
      </Button>
      <ActionIcon onClick={handleDelete} variant={"filled"} color={"var(--mantine-color-red-6)"}>
        <IconTrash />
      </ActionIcon>
    </Group>
  )
}
