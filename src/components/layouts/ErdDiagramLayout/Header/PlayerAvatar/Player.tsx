import {ActionIcon, Avatar, Tooltip} from "@mantine/core";
import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {Player} from "@/enums/playground.ts";
import {IPlayer} from "@/types/table-node";

interface Props {
  player: IPlayer
}

export default function PlayerAvatar(props: Props) {
  const subscribedTo = useErdDiagramStore(state => state.subscribedTo)
  const playground = useErdDiagramStore(state => state.playground)
  const authorizedUser = useAuthStore(state => state.getAuthorization())
  const isSubscribedPlayer = subscribedTo?.id === props.player.id
  const avatarStyle = isSubscribedPlayer? {border: "1px solid var(--mantine-primary-color-filled)", zIndex: 1}: {}
  const tooltipLabel = isSubscribedPlayer? `Subscribed to ${props.player.name}` :`Subscribe to ${props.player.name}`
  const isDisabled = isSubscribedPlayer || props.player.id === authorizedUser?.id

  return (
    <Tooltip label={tooltipLabel}>
      <ActionIcon disabled={isDisabled} variant={"transparent"} onClick={() => playground.player(Player.subscribe, props.player)}>
        <Avatar style={avatarStyle}>
          {props.player.name[0]}
        </Avatar>
      </ActionIcon>
    </Tooltip>
  )
}
