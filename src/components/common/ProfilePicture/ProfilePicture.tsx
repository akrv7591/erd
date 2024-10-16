import {memo} from "react";
import {Avatar, AvatarProps, Image, ImageProps} from "@mantine/core";
import UserIcon from "@/assets/svgs/user.svg";

interface Props extends ImageProps {
  avatarProps?: AvatarProps
}

export const ProfilePicture = memo(({avatarProps, ...imageProps}: Props) => {
  return (
    <Avatar size={"sm"} radius={"md"} {...avatarProps}>
      <Image {...imageProps} fit={"contain"} fallbackSrc={UserIcon}/>
    </Avatar>
  )
})
