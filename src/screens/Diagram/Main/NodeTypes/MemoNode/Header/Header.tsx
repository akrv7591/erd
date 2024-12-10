import { useNodeId } from "@/hooks";
import { ActionIcon, Group } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useReactFlow } from "@xyflow/react";
import { memo } from "react";

export const Header = memo(() => {
  const id = useNodeId()
  const reactFlow = useReactFlow()
  const handleDelete = () => {
    reactFlow.deleteElements({ nodes: [{ id }] })
  }
  return (
    <Group justify="flex-end" p="xs">
      <ActionIcon variant="default" onClick={handleDelete}>
        <IconTrash />
      </ActionIcon>
    </Group>
  )
})