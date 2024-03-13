import {StateCreator} from "zustand";
import {EntityNode, EntityNodeColumn, EntityNodeData, NodeType} from "@/types/entity-node";
import {OnBeforeDelete} from "@xyflow/react";
import {Entity} from "@/enums/playground.ts";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import React from "react";
import {IAddNodeProps} from "@/types/playground";
import {createId} from "@paralleldrive/cuid2";

interface EntityStoreState {
  entities: EntityNode[]
}

interface EntityStoreAction {
  nodeOnDragAdd: (props: IAddNodeProps) => React.DragEventHandler<HTMLDivElement>
  onBeforeDelete: OnBeforeDelete<NodeType>
  resetEntityStore: () => void
}

export type EntityStore = EntityStoreState & EntityStoreAction

const initialState: EntityStoreState = {
  entities: [],
}

export const entityStore: StateCreator<UsePlaygroundStore, [], [], EntityStore> = ((set, get) => ({
  ...initialState,

  //Actions

  nodeOnDragAdd: ({reactFlowInstance}: IAddNodeProps) => (e) => {
    e.preventDefault();

    const type = e.dataTransfer.getData('application/reactflow');

    // check if the dropped element is valid
    if (typeof type === 'undefined' || !type) {
      return;
    }
    const {entities, playground} = get()
    // @ts-ignore
    const targetIsPane = e.target.classList.contains('react-flow__pane');

    if (targetIsPane) {
      const id = createId();
      const columns: EntityNodeColumn[] = []
      const data: EntityNodeData = ({
        name: `table_${entities.length}`,
        color: "#006ab9",
        columns
      })
      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY
      })
      const newNode = {
        id,
        type: "tableNode",
        position,
        data: data,
        createdAt: new Date(),
      };

      playground.table(Entity.add, newNode)
    }
  },

  onBeforeDelete: async ({nodes, edges}) => {
    if (nodes.length > 0) {
      // Node deletion handler
      return new Promise((res) => {
        set({
          confirmModal: {
            ...get().confirmModal,
            opened: true,
            message: `Are you sure you want to delete ${nodes.map(n => n.data.name)} ${nodes.length === 1 ? "entity" : "entities"} with relations?`,
            onConfirm: (callback) => {
              res(true)
              if (callback) {
                callback()
              }
            },
            onCancel: (callback) => {
              res(false)
              if (callback) {
                callback()
              }
            }
          }
        })
      })
    } else {
      // Edge deletion handler
      return new Promise((res) => {
        set({
          confirmModal: {
            ...get().confirmModal,
            opened: true,
            message: `Are you sure you want to delete ${edges.length} ${edges.length === 1 ? "edge" : "edges"} with relation columns?`,
            onConfirm: (callback) => {
              res(true)
              if (callback) {
                callback()
              }
            },
            onCancel: (callback) => {
              res(false)
              if (callback) {
                callback()
              }
            }
          }
        })
      })
    }
  },

  resetEntityStore: () => set({...initialState, playground: undefined}),
}))
