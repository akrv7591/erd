import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {ActionIcon, Tooltip} from "@mantine/core";
import {IconNotes, IconNotesOff} from "@tabler/icons-react";

export default function MemoController() {
  const showMemos = usePlaygroundStore(state => state.showMemos)
  const setShowMemos = usePlaygroundStore(state => state.setShowMemos)
  const toggle = () => setShowMemos(!showMemos)
  return (
    <Tooltip label={showMemos? "Hide memos": "Show memos"} position={"left"}>
      <ActionIcon
        mx={"5px"}
        w={"40px"}
        mt={"auto"}
        h={"40px"}
        variant={"default"}
        onClick={toggle}
      >
        {showMemos? <IconNotesOff/>: <IconNotes />}
      </ActionIcon>
    </Tooltip>
  )
}
