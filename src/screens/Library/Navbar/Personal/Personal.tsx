import {Button, Text} from "@mantine/core";
import {useUser} from "@/hooks";
import {useCallback} from "react";
import {ProfilePicture} from "@/components/common/ProfilePicture";
import { useSelectedTeam } from "@/hooks";

export const Personal = () => {
  const { data: user } = useUser()
  const {setSelectedTeam} = useSelectedTeam()
  const handleClick = useCallback(() => {
    setSelectedTeam(null)
  }, [])
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
      <ProfilePicture src={user.avatar}/>
      <Text truncate={"end"} ml={"sm"}>
        Personal
      </Text>
    </Button>
  )
}
