import {PlaygroundStoreState} from "@/stores/playgroundStore.ts";
import {IErd} from "@/types/data/db-model-interfaces";
import {ServiceArgs} from "@/services/multiplayer/multiplayer";

export type ErdWebsocketPatch = {
  key: keyof IErd,
  value: string | number
}

export const erdService = ({store}: ServiceArgs) => {
  const set = store.setState

  function onPut(data: Omit<PlaygroundStoreState, 'playground'>) {
    set(state => ({...state, ...data}))
  }

  function onPatch({key, value}: { key: string, value: any }) {
    set(state => ({...state, ...{[key]: value}}))
  }

  return {
    onPut,
    onPatch,
  }

}
