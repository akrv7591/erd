import {memo} from "react";
import {useOnViewportChange} from "@xyflow/react";
import {useMouse} from "@mantine/hooks";
import {UsePlaygroundStore, usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useShallow} from "zustand/react/shallow";
import {PlayerEnum} from "@/enums/playground.ts";

const selector = (state: UsePlaygroundStore) => ({
  playground: state.playground,
  subscribers: state.subscribers
})

const ViewportActions = memo(() => {
  const mouse = useMouse()
  const {playground, subscribers} = usePlaygroundStore(useShallow(selector))

  useOnViewportChange({
    onChange: (viewport) => {
      if (subscribers.length > 0) {
        playground.player(PlayerEnum.viewpointChange, viewport)
      }

      if (!mouse.ref.current) {
        return
      }

      if (mouse.ref.current instanceof TouchEvent) {
        // TODO implement mouse move handler
      } else {
        playground.handleMouseMove({x: mouse.x, y: mouse.y})
      }
    }
  })

  return null
})


export default ViewportActions