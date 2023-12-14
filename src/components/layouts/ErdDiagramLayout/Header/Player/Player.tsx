import {IUser} from "../../../../../types/data/user";
import {ActionIcon, Avatar, Tooltip} from "@mantine/core";

interface Props {
  player: IUser
}

export default function Player(props: Props) {
  return (
    <Tooltip label={props.player.name}>
      <ActionIcon variant={"transparent"}>
        <Avatar>
          {props.player.name[0]}
        </Avatar>
      </ActionIcon>
    </Tooltip>
  )
}
