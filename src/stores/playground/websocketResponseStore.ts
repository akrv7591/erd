import {StateCreator} from "zustand";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {ResponseData} from "@/services/multiplayer/playground-service.ts";
import {CallbackDataStatus, ColumnEnum, EntityEnum, ErdEnum, PlayerEnum, Playground, RelationEnum} from "@/enums/playground.ts";
import {notifications} from "@mantine/notifications";
import {orderBy} from "lodash";

interface WebsocketResponseStoreState {}
interface WebsocketResponseStoreAction {
  handlePlaygroundResponse: (res: ResponseData<Playground>) => void
}

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
            case ErdEnum.put:
                  notifications.show({
                    title: `${data.name} erd is updated`,
                    message: "Success"
                  })
              return {...cur, ...data}
            case ErdEnum.patch:
              return {...cur, ...{[data.key]: data.value}}
            case PlayerEnum.subscribe:
              return {subscribedTo: data, viewport: null}

            case PlayerEnum.unsubscribe:
              return {subscribedTo: null, viewport: null}

            case PlayerEnum.viewpointChange:
              return {}

            case PlayerEnum.mouseChange:
              return {}

            case EntityEnum.add:
              return {entities: [...cur.entities, data]}

            case EntityEnum.update:
              return {}

            case EntityEnum.delete:
              return {entities: cur.entities.filter(entity => entity.id !== data)}

            case EntityEnum.set:
              return {
                entities: cur.entities.map(entity => entity.id === data.entityId ? {
                  ...entity,
                  data: {...entity.data, ...data.data}
                } : entity)
              }

            case RelationEnum.add:
              return {relations: [...cur.relations, data.relation]}

            case RelationEnum.delete:
              return {relations: cur.relations.filter(r => r.id !== data.relation.id)}

            case ColumnEnum.add:
              return {
                entities: cur.entities.map(table => {
                  if (table.id === data.column.entityId) {
                    return {
                      ...table,
                      data: {
                        ...table.data,
                        columns: [...table.data.columns, data.column]
                      }
                    }
                  }
                  return table
                })
              }

            case ColumnEnum.update:
              return {
                entities: cur.entities.map(table => {
                  if (table.id === data.column.entityId) {
                    const columns = orderBy(table.data.columns.map(c => {
                      if (c.id !== data.column.id) {
                        return c
                      }
                      return {
                        ...c,
                        [data.column.key]: data.column.value
                      }
                    }), 'order', 'asc')
                    return {
                      ...table,
                      data: {
                        ...table.data,
                        columns
                      }
                    }
                  }
                  return table
                })
              }

            case ColumnEnum.delete:
              return {
                entities: cur.entities.map(entity => {
                  if (entity.id === data.column.entityId) {
                    return {
                      ...entity,
                      data: {
                        ...entity.data,
                        columns: entity.data.columns.filter(c => c.id !== data.column.id)
                      }
                    }
                  }
                  return entity
                })
              }

            default:
              return {}
          }

        }
      )
    }
  }
}))
