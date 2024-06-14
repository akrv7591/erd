import {useRef} from "react";
import {createPlaygroundStore} from "@/stores/playgroundStore.ts";
import {PlaygroundStoreContext} from "@/contexts/playground/PlaygroundStoreContext.ts";
import type {FC, PropsWithChildren} from "react"
import type {PlaygroundStore} from "@/contexts/playground/PlaygroundStoreContext"


const PlaygroundStoreProvider: FC<PropsWithChildren> = (props) => {
  const store = useRef<PlaygroundStore>()

  if (!store.current) {
    store.current = createPlaygroundStore()
  }

  return (
    <PlaygroundStoreContext.Provider value={store.current}>
      {props.children}
    </PlaygroundStoreContext.Provider>
  )
}


export default PlaygroundStoreProvider
