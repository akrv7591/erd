import {ActionIcon, Tooltip} from "@mantine/core";
import {IconNotes, IconNotesOff} from "@tabler/icons-react";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

export default function MemoController() {
  const showMemos = usePlayground(state => state.showMemos)
  const setShowMemos = usePlayground(state => state.setShowMemos)
  const toggle = () => setShowMemos(!showMemos)
  return (
    <Tooltip label={showMemos? "Hide memos": "Show memos"} position={"left"}>
      <ActionIcon
        mx={"5px"}
        w={"40px"}
        h={"40px"}
        variant={"default"}
        onClick={toggle}
      >
        {showMemos? <IconNotesOff/>: <IconNotes />}
      </ActionIcon>
    </Tooltip>
  )
}
