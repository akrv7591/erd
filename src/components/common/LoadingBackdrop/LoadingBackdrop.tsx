import {Center, Loader, Overlay, OverlayProps, Stack, Text} from "@mantine/core";
import {FC, memo, ReactNode} from "react";

interface Props extends OverlayProps {
  title?: string | ReactNode
}

export const LoadingBackdrop: FC<Props> = memo(({title, ...overlayProps}) => {
  return (
    <Overlay {...overlayProps}>
      <Center h={"100%"} w={"100%"}>
        <Stack align={"center"}>
          <Loader />
          {title && (
            <Text>{title}</Text>
          )}
        </Stack>
      </Center>
    </Overlay>
  )
})
