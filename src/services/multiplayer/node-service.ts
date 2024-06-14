import {CallbackDataStatus, NodeEnum} from "@/enums/playground.ts";
import {ServiceArgs} from "@/services/multiplayer/multiplayer";
import {Node} from "@xyflow/react";

export const nodeService = ({store, socket}: ServiceArgs) => {
  const set = store.setState
  const state = store.getState

  function deleteNodesType(id: string) {
    state().playground.nodesType.delete(id)
  }

  socket.on(NodeEnum.patchPositions, (data, callback) => {
    const nodeIds = data.map(node => node.nodeId)
    try {
      set(state => ({
        nodes: state.nodes.map(node => {
          if (!nodeIds.includes(node.id)) return node

          const nodePosition = data.find(n => n.nodeId === node.id)!.position

          return {
            ...node,
            position: nodePosition
          }
        })
      }))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(NodeEnum.patchPositions, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(NodeEnum.add, (data, callback) => {
    try {
      const node = data.node as Node
      set(state => ({nodes: [...state.nodes, node]}))
    } catch (e) {
      console.error(NodeEnum.add, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(NodeEnum.delete, (data, callback) => {
    try {
      set(state => ({
        nodes: state.nodes.filter(node => {
          const deleteNode = !data.nodeId.includes(node.id)
          if (deleteNode) deleteNodesType(node.id)
          return deleteNode
        })
      }))
    } catch (e) {
      console.error(NodeEnum.delete, e)
      callback(CallbackDataStatus.FAILED)
    }
  })
}
