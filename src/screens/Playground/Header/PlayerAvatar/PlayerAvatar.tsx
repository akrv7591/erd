import {Avatar, Tooltip} from "@mantine/core";
import classes from "./style.module.css"
import {memo} from "react";
import {IconUser} from "@tabler/icons-react";
import {Client} from "@/types/playground";
import {useClient} from "@/hooks/Diagram/useClient.ts";

interface Props {
  client: Client
}

export const PlayerAvatar = memo((props: Props) => {
  const {data} = useClient(props.client.userId)
  const outlineColor = props.client.color

  if (!data) {
    return null
  }

  return (
    <Tooltip label={data.name}>
      <Avatar
        size={30}
        src={data?.profile?.image?.url || null}
        alt={"user-avatar"}
        color={outlineColor}
        classNames={{
          root: classes.root
        }}
        styles={{
          root: {outlineColor}
        }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <IconUser size={15}/>
      </Avatar>
    </Tooltip>
  )
})
