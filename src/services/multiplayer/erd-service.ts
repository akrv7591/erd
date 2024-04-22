import {PlaygroundStoreState, usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {IErd} from "@/types/data/db-model-interfaces";

export type ErdWebsocketPatch = {
  key: keyof IErd,
  value: string | number
}

export const erdService = () => {

  function onPut(data: Omit<PlaygroundStoreState, 'playground'>) {
    usePlaygroundStore.setState(state => ({...state, ...data}))
  }

  function onPatch({key, value}: { key: string, value: any }) {
    usePlaygroundStore.setState(state => ({...state, ...{[key]: value}}))
  }

  return {
    onPut,
    onPatch,
  }

}
