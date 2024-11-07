import {Tooltip} from "@mantine/core";
import {IconNotes, IconNotesOff} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import { useDiagramStore } from "@/hooks";

export const MemoController = () => {
  const showMemos = useDiagramStore(state => state.memo)
  const setShowMemos = useDiagramStore(state => state.setMemo)
  const toggle = () => setShowMemos(!showMemos)
  return (
    <Tooltip label={showMemos ? "Hide memos" : "Show memos"} position={"left"}>
      <PlaygroundActionIcon onClick={toggle}>
        {showMemos ? <IconNotesOff/> : <IconNotes/>}
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
