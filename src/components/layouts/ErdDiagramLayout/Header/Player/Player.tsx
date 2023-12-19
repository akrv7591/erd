import {IUser} from "../../../../../types/data/user";
import {ActionIcon, Avatar, Tooltip} from "@mantine/core";
import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";

interface Props {
  player: IUser
}

export default function Player(props: Props) {
  const subscribedTo = useErdDiagramStore(state => state.subscribedTo)
  const setSubscribedTo = useErdDiagramStore(state => state.setSubscribedTo)
  const isSubscribedPlayer = subscribedTo?.id === props.player.id
  const avatarStyle = isSubscribedPlayer? {border: "1px solid var(--mantine-primary-color-filled)"}: {}
  const tooltipLabel = isSubscribedPlayer? `Subscribed to ${props.player.name}` :`Subscribe to ${props.player.name}`
  const onSubscribe = () => {
    setSubscribedTo(props.player)
  }

  return (
    <Tooltip label={tooltipLabel}>
      <ActionIcon variant={"transparent"} onClick={onSubscribe}>
        <Avatar style={avatarStyle}>
          {props.player.name[0]}
        </Avatar>
      </ActionIcon>
    </Tooltip>
  )
}
