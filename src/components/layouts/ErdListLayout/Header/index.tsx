import {ActionIcon, Avatar, Group, Text, Tooltip} from "@mantine/core";
import {IconUser} from "@tabler/icons-react";

export default function Header() {
  return (
    <Group align={"center"} justify={"space-between"} px={"20px"} h={"100%"}>
      <Text>ERD</Text>
      <Tooltip label={"User"}>
        <ActionIcon variant={"transparent"}>
          <Avatar>
            <IconUser stroke={1}/>
          </Avatar>
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}
