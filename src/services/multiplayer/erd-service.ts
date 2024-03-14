import {PlaygroundStoreState, usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

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
