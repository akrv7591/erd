import {createStore} from "zustand";
import {entityStore} from "./stores/entityStore.ts";
import {relationStore} from "./stores/relationStore.ts";
import {flowStore} from "./stores/flowStore.ts";
import {memoStore} from "./stores/memoStore.ts";
import {erdStore} from "./stores/erdStore.ts";
import yjs from "akrv-zustand-middleware-yjs"
import * as Y from "yjs";

// import types
import type {MemoStore} from "./stores/memoStore.ts";
import type {FlowStore} from "./stores/flowStore.ts";
import type {RelationStore} from "./stores/relationStore.ts";
import type {EntityStore} from "./stores/entityStore.ts";
import type {ErdStore} from "./stores/erdStore.ts";
import type {HocuspocusProvider} from "@hocuspocus/provider";
import type {DiagramContext} from "@/contexts/DiagramContext.ts";

type SharedDiagramStoreActions = {
  getStore: () => DiagramContext
}

export type SharedDiagramStore = SharedDiagramStoreActions
  & EntityStore
  & RelationStore
  & FlowStore
  & MemoStore
  & ErdStore
  // & ClientStore

interface Params {
  yDoc: Y.Doc
  id: string
  store: DiagramContext,
  yProvider: HocuspocusProvider
}

export const createSharedDiagramStore = ({yDoc, id, store, yProvider}: Params) => {
  const sharedDiagramStore = createStore<SharedDiagramStore>()(yjs(
    yDoc,
    id,
    (...a) => ({
      ...entityStore(...a),
      ...relationStore(...a),
      ...flowStore(...a),
      ...memoStore(...a),
      ...erdStore(...a),

      getStore: () => store,
      getYProvider: () => yProvider
    }),
  ))

  sharedDiagramStore.subscribe((state, prevState) => {
    if (state.nodes !== prevState.nodes) {
      state.getStore().setState(localState => {
        const sharedNodeKeys = new Set(Object.keys(state.nodes))
        const localNodeKeys = new Set(localState.nodes.map(node => node.id))
        const addedNodes = sharedNodeKeys.difference(localNodeKeys)
        const removedNodes = localNodeKeys.difference(sharedNodeKeys)

        if (!addedNodes.size && !removedNodes.size) {
          return {}
        }

        const nodes = [
          ...localState.nodes.filter(node => !removedNodes.has(node.id)), // removing nodes from local state
        ]

        addedNodes.forEach(nodeId => {
          nodes.push(state.nodes[nodeId])
        })

        return {
          nodes
        }
      })
    }
  })

  return sharedDiagramStore
}
