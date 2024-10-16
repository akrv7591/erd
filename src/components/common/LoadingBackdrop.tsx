import {Center, Loader, Overlay, OverlayProps, Stack, Text} from "@mantine/core";
import {ReactNode} from "react";

interface Props extends OverlayProps {
  title?: string | ReactNode
}

export default function LoadingBackdrop({title, ...overlayProps}: Props) {
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
}
