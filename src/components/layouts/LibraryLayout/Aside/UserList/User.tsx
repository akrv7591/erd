import classes from "../style.module.css";
import {Avatar, Group, Text} from "@mantine/core";
import {IconUser} from "@tabler/icons-react";
import {IUser} from "../../../../../types/data/user";

interface Props {
  user: IUser
}

export default function User({user}: Props) {
  return (
    <Group
      className={classes.team}
      wrap={"nowrap"}
      gap={0}
    >
      <Avatar size={"sm"}>
        <IconUser size={18}/>
      </Avatar>
      <Text mr={"auto"} size={"sm"} truncate={"end"} ml={"sm"}>
        {user.name}
      </Text>
    </Group>
  )
}
