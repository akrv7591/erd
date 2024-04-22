import {StateCreator} from "zustand";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {
  CallbackDataStatus,
  ColumnEnum,
  EntityEnum,
  ErdEnum,
  MemoEnum,
  PlayerEnum,
  RelationEnum
} from "@/enums/playground.ts";
import {notifications} from "@mantine/notifications";
import {orderBy} from "lodash";

import type {EntityNodeData} from "@/types/entity-node";
import {EntityNodeColumn} from "@/types/entity-node";
import type {ResponseData} from "@/types/playground";
import {NodeType} from "@/types/playground";
import type {IErd} from "@/types/data/db-model-interfaces";
import {EntityWebsocketPatch} from "@/services/multiplayer/entity-service.ts";
import {MemoWebsocketPatch} from "@/services/multiplayer/memo-service.ts";
import {ErdWebsocketPatch} from "@/services/multiplayer/erd-service.ts";
import {ColumnWebsocketPatch} from "@/services/multiplayer/column-service.ts";
import {Edge} from "@xyflow/react";

type ErdWebsocketResponse = {
  handlePlaygroundResponse(data: ResponseData<ErdEnum.put, Omit<IErd, 'entities' | 'memos' | 'team' | 'relations'>>): void
  handlePlaygroundResponse(data: ResponseData<ErdEnum.patch, ErdWebsocketPatch>): void
}

type EntityWebsocketResponse = {
  handlePlaygroundResponse(data: ResponseData<EntityEnum.add, NodeType>): void
  handlePlaygroundResponse(data: ResponseData<EntityEnum.patch, EntityWebsocketPatch>): void
  handlePlaygroundResponse(data: ResponseData<EntityEnum.delete, string[]>): void
}

type MemoWebsocketResponse = {
  handlePlaygroundResponse(data: ResponseData<MemoEnum.add, NodeType>): void
  handlePlaygroundResponse(data: ResponseData<MemoEnum.patch, MemoWebsocketPatch>): void
  handlePlaygroundResponse(data: ResponseData<MemoEnum.delete, string[]>): void
}

type ColumnWebsocketResponse = {
  handlePlaygroundResponse(data: ResponseData<ColumnEnum.add, EntityNodeColumn>): void
  handlePlaygroundResponse(data: ResponseData<ColumnEnum.patch, ColumnWebsocketPatch>): void
  handlePlaygroundResponse(data: ResponseData<ColumnEnum.delete, { entityId: string, columnId: string[] }>): void
}

type RelationWebsocketResponse = {
  handlePlaygroundResponse(data: ResponseData<RelationEnum.add, Edge>): void
  handlePlaygroundResponse(data: ResponseData<RelationEnum.delete, string[]>): void
}

type PlayerWebsocketResponse = {
  handlePlaygroundResponse(data: ResponseData<PlayerEnum.subscribe, string>): void
  handlePlaygroundResponse(data: ResponseData<PlayerEnum.unsubscribe, string>): void
  handlePlaygroundResponse(data: ResponseData<PlayerEnum.viewpointChange, null>): void
  handlePlaygroundResponse(data: ResponseData<PlayerEnum.mouseChange, null>): void

}

interface WebsocketResponseStoreState {
}


type WebsocketResponseStoreAction = {}
  & ErdWebsocketResponse
  & EntityWebsocketResponse
  & MemoWebsocketResponse
  & ColumnWebsocketResponse
  & RelationWebsocketResponse
  & PlayerWebsocketResponse

export type WebsocketResponseStore = WebsocketResponseStoreState & WebsocketResponseStoreAction

export const websocketResponseStore: StateCreator<UsePlaygroundStore, [], [], WebsocketResponseStore> = ((set) => ({
  handlePlaygroundResponse: ({status, type, data}) => {
    if (status !== CallbackDataStatus.OK) {
      notifications.show({
        title: type,
        message: status,
        color: "var(--mantine-color-red-filled)"
      })
    } else {

      set(cur => {
          switch (type) {
            // Erd websocket response handlers
            case ErdEnum.put:
              return {...cur, ...data}

            case ErdEnum.patch:
              return {...cur, ...{[data.key]: data.value}}

            // Entity websocket response handlers
            case EntityEnum.add:
              return {nodes: [...cur.nodes, data]}

            case EntityEnum.patch:
              return {
                nodes: cur.nodes.map(entity => entity.id === data.entityId ? {
                  ...entity,
                  data: {...entity.data, [data.key]: data.value}
                } : entity)
              }

            case EntityEnum.delete:
              // Since entity is node delete websocket response handled on NodeEnum.delete
              return {}

            // Memo websocket response handlers
            case MemoEnum.add:
              return {nodes: [...cur.nodes, data]}
            case MemoEnum.patch:
              if (data.key === "content") {
                return {}
              }
              return {
                nodes: cur.nodes.map(node => node.id === data.memoId ? {
                  ...node,
                  data: {...node.data, [data.key]: data.value}
                } : node)
              }
            case MemoEnum.delete:
              // Since memo is node delete websocket response handled on NodeEnum.delete
              return {}

            // Column websocket response handlers
            case ColumnEnum.add:
              return {
                nodes: cur.nodes.map((node) => {
                  if (node.id === data.entityId) {
                    let entityData = node.data as EntityNodeData
                    return {
                      ...node,
                      data: {
                        ...entityData,
                        columns: [...entityData.columns, data]
                      }
                    }
                  }

                  return node
                })
              }

            case ColumnEnum.patch:
              return {
                nodes: cur.nodes.map(node => {
                  if (node.id !== data.entityId) {
                    return node
                  }

                  const entityData = node.data as EntityNodeData
                  let columns: EntityNodeColumn[]

                  if (data.key === "order") {
                    columns = orderBy(entityData.columns.map(column => column.id === data.columnId ? {
                      ...column,
                      [data.key]: data.value
                    } : column), 'order', 'asc')
                  } else {
                    columns = entityData.columns.map(c => c.id === data.columnId ? {...c, [data.key]: data.value} : c)

                  }
                  return {
                    ...node,
                    data: {
                      ...entityData,
                      columns: [...columns]
                    }
                  }
                })
              }

            case ColumnEnum.delete:
              const {entityId, columnId} = data
              return {
                nodes: cur.nodes.map((entity) => {
                  if (entity.id === entityId) {
                    const entityData = entity.data as EntityNodeData
                    return {
                      ...entity,
                      data: {
                        ...entityData,
                        columns: entityData.columns.filter(c => !columnId.includes(c.id))
                      }
                    }
                  }
                  return entity
                })
              }

            // Relation websocket response handlers
            case RelationEnum.add:
              return {relations: [...cur.relations, data]}

            case RelationEnum.delete:
              return {relations: cur.relations.filter(relation => !data.includes(relation.id))}

            // Player websocket response handlers
            case PlayerEnum.subscribe:
              return {subscribedTo: data, viewport: null}

            case PlayerEnum.unsubscribe:
              return {subscribedTo: null, viewport: null}

            case PlayerEnum.viewpointChange:
              return {}

            case PlayerEnum.mouseChange:
              return {}

            default:
              return {}
          }
        }
      )
    }
  }
}))
