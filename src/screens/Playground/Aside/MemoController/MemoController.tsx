import {Tooltip} from "@mantine/core";
import {IconNotes, IconNotesOff} from "@tabler/icons-react";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";

export const MemoController = () => {
  const showMemos = usePlayground(state => state.showMemos)
  const setShowMemos = usePlayground(state => state.setShowMemos)
  const toggle = () => setShowMemos(!showMemos)
  return (
    <Tooltip label={showMemos ? "Hide memos" : "Show memos"} position={"left"}>
      <PlaygroundActionIcon onClick={toggle}>
        {showMemos ? <IconNotesOff/> : <IconNotes/>}
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
