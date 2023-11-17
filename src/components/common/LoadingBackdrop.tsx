import {Center, Loader, Overlay, OverlayProps} from "@mantine/core";

export default function LoadingBackdrop(props: OverlayProps) {
  return (
    <Overlay {...props}>
      <Center h={"100%"} w={"100%"}>
        <Loader />
      </Center>
    </Overlay>
  )
}
