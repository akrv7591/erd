import {Tooltip} from "@mantine/core";
import {IconNotes, IconNotesOff} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import { useDiagramStore } from "@/hooks";
import {memo} from "react";

export const MemoController = memo(() => {
  const isMemosVisible = useDiagramStore(state => state.isMemosVisible)
  const toggleMemosVisibility = useDiagramStore(state => state.toggleMemosVisibility)
  return (
    <Tooltip label={isMemosVisible ? "Hide memos" : "Show memos"} position={"left"}>
      <PlaygroundActionIcon onClick={toggleMemosVisibility}>
        {isMemosVisible ? <IconNotesOff/> : <IconNotes/>}
      </PlaygroundActionIcon>
    </Tooltip>
  )
})
