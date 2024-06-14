import {forwardRef} from "react";
import {ActionIcon, ActionIconProps, ElementProps} from "@mantine/core";

interface Props extends ActionIconProps, ElementProps<'button', keyof ActionIconProps> {}

export const PlaygroundActionIcon = forwardRef<any, Props>((props, ref) => {
  return (
    <ActionIcon size={"40px"} variant={"default"} ref={ref} {...props} />
  )
})
