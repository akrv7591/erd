import {createStore} from "zustand";
import {entityStore} from "./stores/entityStore.ts";
import {relationStore} from "./stores/relationStore.ts";
import {flowStore} from "./stores/flowStore.ts";
import {memoStore} from "./stores/memoStore.ts";
import {erdStore} from "./stores/erdStore.ts";
import yjs from "akrv-zustand-middleware-yjs"
import * as Y from "yjs";
import difference from "lodash/difference"

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

  let initialLoad = true

  sharedDiagramStore.subscribe((state, prevState) => {
    if (initialLoad) {
      initialLoad = false

      store.setState({
        synced: true
      })
    }
    if (state.nodes !== prevState.nodes) {
      state.getStore().setState(localState => {
        const sharedNodeKeys = Array.from(Object.keys(state.nodes))
        const localNodeKeys = localState.nodes.map(node => node.id)
        const addedNodes = difference(sharedNodeKeys, localNodeKeys)
        const removedNodes = difference(difference(localNodeKeys, sharedNodeKeys))
        const nodes = [
          ...localState.nodes.filter(node => !removedNodes.includes(node.id)), // removing nodes from local state
        ]

        addedNodes.forEach(nodeId => {
          nodes.push(state.nodes[nodeId])
        })

        nodes.forEach(node => {
          const sharedNode = state.nodes[node.id]

          if (!sharedNode) {
            return
          }

          const {x, y} = sharedNode.position
          const {x: x2, y: y2} = node.position

          if (x !== x2 || y !== y2) {
            node.position = {
              ...sharedNode.position
            }
          }
        })

        return {
          nodes
        }
      })
    }
  })

  return sharedDiagramStore
}
