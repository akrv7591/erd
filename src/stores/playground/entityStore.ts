import {StateCreator} from "zustand";
import {EntityNode, EntityNodeColumn, EntityNodeData} from "@/types/entity-node";
import {NodeChange} from "@xyflow/react";
import {EntityEnum} from "@/enums/playground.ts";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import React from "react";
import {IAddNodeProps} from "@/types/playground";
import {createId} from "@paralleldrive/cuid2";

interface EntityStoreState {
  entities: EntityNode[]
}

interface EntityStoreAction {
  nodeOnDragAdd: (props: IAddNodeProps) => React.DragEventHandler<HTMLDivElement>
  resetEntityStore: () => void
  onEntityNodeChange: (node: NodeChange<EntityNode>) => void
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

      playground.table(EntityEnum.add, newNode)
    }
  },

  onEntityNodeChange: (node) => {
    const state = get()
    switch (node.type) {
      case "add":
        break
      case "replace":
        state.playground.table(EntityEnum.update, {
          erdId: state.id,
          id: node.item.id,
          type: node.item.type,
          position: node.item.position,
        })
        break
      case "position":
        const {id, type, position} = state.entities.find(oldNode => oldNode.id === node.id)!

        if (node.position && position !== node.position) {
          state.playground.table(EntityEnum.update, {
            erdId: state.id,
            id,
            type,
            position: node.position!,
          })
        }

        break
      case "remove":
        state.playground.table(EntityEnum.delete, node.id)
        break
      default:
    }
  },

  resetEntityStore: () => set({...initialState, playground: undefined}),
}))
