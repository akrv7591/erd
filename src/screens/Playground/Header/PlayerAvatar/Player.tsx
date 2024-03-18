import {ActionIcon, Popover, Text, Tooltip} from "@mantine/core";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {PlayerEnum} from "@/enums/playground.ts";
import {LivePlayer} from "@/types/entity-node";
import classes from "./style.module.css"
import {useDisclosure} from "@mantine/hooks";
import {memo, useEffect} from "react";

interface Props {
  player: LivePlayer
}

const PlayerAvatar = memo((props: Props) => {
  const subscribedTo = usePlaygroundStore(state => state.subscribedTo)
  const subscribers = usePlaygroundStore(state => state.subscribers)
  const playground = usePlaygroundStore(state => state.playground)
  const authorizedUser = useAuthStore(state => state.getAuthorization())
  const isSubscribedPlayer = subscribedTo?.id === props.player.id
  const isYou = props.player.id === authorizedUser?.id
  const isFollowing = subscribers?.some(subscriber => subscriber === props.player.id)
  const [opened, {close, open}] = useDisclosure(false)
  const tooltipLabel = isSubscribedPlayer
    ? `Click on diagram plane to exit follow mode`
    : isFollowing
      ? "You can't follow who is already following you"
      : `Follow ${props.player.name}`
  const isDisabled = isSubscribedPlayer || props.player.id === authorizedUser?.id
  const onSubscribe = () => {
    if (!isFollowing) {
      playground.player(PlayerEnum.subscribe, props.player)
    }
  }

  useEffect(() => {
    if (isFollowing) {
      open()

      setTimeout(() => {
        close()
      }, 5000)
    }
  }, [isFollowing, open, close])

  return (
    <Popover withArrow opened={opened}>
      <Popover.Target>
        <Tooltip hidden={isYou} label={tooltipLabel} {...isSubscribedPlayer && {opened: true}}>
          <ActionIcon
            className={isSubscribedPlayer ? classes.avatarSubscribed : classes.avatar}
            size={"lg"}
            radius={"xl"}
            variant={"default"}
            onClick={onSubscribe}
            disabled={isDisabled}

          >
            {props.player.name[0]}
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown p={"xs"}>
        <Text className={classes.followingText}>
          {props.player.name} <br/> following
        </Text>
      </Popover.Dropdown>
    </Popover>

  )
})

export default PlayerAvatar
