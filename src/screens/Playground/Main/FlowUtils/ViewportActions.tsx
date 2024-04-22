import {memo} from "react";
import {useOnViewportChange} from "@xyflow/react";
import {PlayerEnum} from "@/enums/playground.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

const ViewportActions = memo(() => {
  const subscribers = usePlaygroundStore(state => state.subscribers)
  const playground = usePlaygroundStore(state => state.playground)

  useOnViewportChange(({
    onChange: viewport => {
      if (subscribers.length > 0) {
        console.log(viewport)
        playground.player(PlayerEnum.viewpointChange, viewport)
      }
    }
  }))
  return null
})


export default ViewportActions
