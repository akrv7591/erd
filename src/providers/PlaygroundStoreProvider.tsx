import type {FC, PropsWithChildren} from "react"
import type {PlaygroundStore} from "@/contexts/playground/PlaygroundStoreContext"

import {useRef} from "react";
import {createPlaygroundStore} from "@/stores/playgroundStore.ts";
import {PlaygroundStoreContext} from "@/contexts/playground/PlaygroundStoreContext.ts";


interface Props {
}

const PlaygroundStoreProvider: FC<PropsWithChildren<Props>> = (props) => {
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
