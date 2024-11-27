import {ActionIcon, Card, Group, Textarea} from "@mantine/core";
import {useMemoNode} from "@/hooks";
import {ChangeEventHandler, memo, useCallback} from "react";
import {useReactFlow} from "@xyflow/react";
import classes from "./style.module.css"
import { IconTrash } from "@tabler/icons-react";
import { useUpdateMemoContent } from "@/hooks";

export const Editor = memo(() => {
  const {id, data} = useMemoNode()
  const reactFlow = useReactFlow()
  const updateMemoContent = useUpdateMemoContent()
  const handleContentChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    updateMemoContent(e.target.value)
  }, [])

  const handleDelete = useCallback(() => {
    if (!id) return

    reactFlow.deleteElements({nodes: [{id}]})

  }, [])

  return (
    <Card p={0}>
      <Group justify="flex-end" p="xs">
        <ActionIcon variant="default" onClick={handleDelete}>
          <IconTrash />
        </ActionIcon>
      </Group>
      <Textarea
        value={data.content}
        onChange={handleContentChange}
        autosize
        minRows={8}
        size="sm"
        classNames={{
          input: classes.input
        }}
      />
    </Card>
  )
})
