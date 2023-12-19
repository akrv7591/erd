import {IUser} from "../../../../../types/data/user";
import {ActionIcon, Avatar, Tooltip} from "@mantine/core";
import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";

interface Props {
  player: IUser
}

export default function Player(props: Props) {
  const subscribedTo = useErdDiagramStore(state => state.subscribedTo)
  const setSubscribedTo = useErdDiagramStore(state => state.setSubscribedTo)
  const authorizedUser = useAuthStore(state => state.getAuthorization())
  const isSubscribedPlayer = subscribedTo?.id === props.player.id
  const avatarStyle = isSubscribedPlayer? {border: "1px solid var(--mantine-primary-color-filled)", zIndex: 1}: {}
  const tooltipLabel = isSubscribedPlayer? `Subscribed to ${props.player.name}` :`Subscribe to ${props.player.name}`
  const onSubscribe = () => {
    setSubscribedTo(props.player)
  }

  return (
    <Tooltip label={tooltipLabel}>
      <ActionIcon disabled={props.player.id === authorizedUser?.id} variant={"transparent"} onClick={onSubscribe}>
        <Avatar style={avatarStyle}>
          {props.player.name[0]}
        </Avatar>
      </ActionIcon>
    </Tooltip>
  )
}
