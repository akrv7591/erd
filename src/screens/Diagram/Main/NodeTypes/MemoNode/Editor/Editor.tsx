import { Textarea } from "@mantine/core";
import { useMemoNode } from "@/hooks";
import { ChangeEventHandler, memo, useCallback } from "react";
import classes from "./style.module.css"

import { useUpdateMemoContent } from "@/hooks";

export const Editor = memo(() => {
  const { data } = useMemoNode()
  const updateMemoContent = useUpdateMemoContent()
  
  const handleContentChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    updateMemoContent(e.target.value)
  }, [])

  return (
    <Textarea
      variant="unstyled"
      value={data.content}
      onChange={handleContentChange}
      autosize
      minRows={8}
      size="sm"
      classNames={{
        input: classes.input
      }}
    />
  )
})
