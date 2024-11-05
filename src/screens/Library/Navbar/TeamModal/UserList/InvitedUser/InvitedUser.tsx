import {Badge, Group, TextInput} from "@mantine/core";
import {memo} from "react";
import {TeamInvitationResponse} from "@/types/log-to/team-invitation";

interface Props {
  user: TeamInvitationResponse
}

export const InvitedUser = memo(({user}: Props) => {
  return (
    <Group align={"flex-end"} gap={"xs"}>
      <TextInput
        value={user.invitee}
        placeholder={"user@erdiagramly.com"}
        style={{flex: 1}}
        disabled
        rightSection={<Badge color={"var(--mantine-color-orange-9)"}>{user.status}</Badge>}
        rightSectionWidth={100}
      />
    </Group>
  )
})
