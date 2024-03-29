import {Avatar, Popover, Text, Tooltip} from "@mantine/core";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {PlayerEnum} from "@/enums/playground.ts";
import {LivePlayer} from "@/types/entity-node";
import classes from "./style.module.css"
import {useDisclosure} from "@mantine/hooks";
import {memo, useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {userWithProfileApi} from "@/api/user.ts";

interface Props {
  player: LivePlayer
}

const PlayerAvatar = memo((props: Props) => {
  const subscribedTo = usePlaygroundStore(state => state.subscribedTo)
  const subscribers = usePlaygroundStore(state => state.subscribers)
  const playground = usePlaygroundStore(state => state.playground)
  const user = useAuthStore(state => state.user)
  const isSubscribedPlayer = subscribedTo?.id === props.player.id
  const isYou = props.player.id === user.id
  const isFollowing = subscribers?.some(subscriber => subscriber === props.player.id)
  const [opened, {close, open}] = useDisclosure(false)
  const {data} = useQuery({
    queryKey: ["player-avatar", props.player.id],
    queryFn: () => userWithProfileApi(props.player.id)
  })

  const tooltipLabel = isSubscribedPlayer
    ? `Click on diagram plane to exit follow mode`
    : isFollowing
      ? "You can't follow who is already following you"
      : `Follow ${props.player.name}`
  const isDisabled = isSubscribedPlayer || props.player.id === user.id
  const onSubscribe = () => {

    if (!isFollowing && !isDisabled) {
      playground.player(PlayerEnum.subscribe, props.player)
    }
  }

  useEffect(() => {
    if (isFollowing) {
      open()

      setTimeout(() => {
        close()
      }, 3000)
    }
  }, [isFollowing, open, close])


  return (
  <Popover withArrow opened={opened}>
    <Popover.Target>
      <Tooltip hidden={isYou} label={tooltipLabel} {...isSubscribedPlayer && {opened: true}}>
        <Avatar
          size={30}
          src={data?.profile?.image?.url || ""}
          alt={"user-avatar"}
          onClick={onSubscribe}
          className={isSubscribedPlayer ? classes.avatarSubscribed : classes.avatar}
        />
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
