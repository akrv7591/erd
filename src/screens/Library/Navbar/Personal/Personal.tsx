import {Button, Text} from "@mantine/core";
import {useUser} from "@/hooks";
import {useLibraryStore} from "@/stores/useLibrary";
import {useCallback} from "react";
import {ProfilePicture} from "@/components/common/ProfilePicture";

export const Personal = () => {
  const user = useUser()
  const setTeam = useLibraryStore(state => state.setTeam)
  const personalTeam = useLibraryStore(state => state.personal)
  const handleClick = useCallback(() => {
    setTeam(personalTeam)
  }, [setTeam, personalTeam])
  return (
    <Button
      style={{
        display: "flex",
        justifyContent: "flex-start"
      }}
      c={"var(--mantine-color-text)"}
      onClick={handleClick}
      variant={"transparent"}
      px={"xs"}
      h={"50px"}
    >
      <ProfilePicture src={user.picture}/>
      <Text truncate={"end"} ml={"sm"}>
        Personal
      </Text>
    </Button>
  )
}
