import {Tooltip} from "@mantine/core";
import {IconNotes, IconNotesOff} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";

export const MemoController = () => {
  const showMemos = useSharedDiagramStore(state => state.showMemos)
  const setShowMemos = useSharedDiagramStore(state => state.setShowMemos)
  const toggle = () => setShowMemos(!showMemos)
  return (
    <Tooltip label={showMemos ? "Hide memos" : "Show memos"} position={"left"}>
      <PlaygroundActionIcon onClick={toggle}>
        {showMemos ? <IconNotesOff/> : <IconNotes/>}
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
