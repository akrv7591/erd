import {EntityColumn, EntityData, EntityNode} from "@/types/diagram";
import {NODE_TYPES} from "@/screens/Diagram/Main/NodeTypes";
import {XYPosition} from "@xyflow/react";
import {DIAGRAM} from "@/namespaces";
import {DEFAULT_COLUMN_DATA} from "@/constants/diagram/column";
import {DiagramStore} from "@/stores/diagram-store";
import {NODE} from "@/namespaces/broadcast/node";
import {ShortId} from "@/utility/ShortId";

export class EntityUtils {
  static generateEntity(defaultData: EntityNode): EntityNode {
    if (!defaultData.id) {
      defaultData.id = ShortId.create()
    }

    return  defaultData
  }

  static genNewEntityNode(position: XYPosition, customData?: EntityNode['data']) {
    const id = ShortId.create();
    const name = "Table"
    const defaultData = {
      name,
      color: "#006ab9",
      columns: []
    }
    const data = customData? customData: defaultData

    const node: EntityNode = {
      id,
      type: NODE_TYPES.ENTITY,
      position,
      data: {
        ...data,
        columns: data.columns.map(EntityUtils.columnWithNewId)
      },
    };

    return node
  }

  static primaryColumn(defaultData: EntityColumn): EntityColumn {
    return {
      ...defaultData,
      primary: true,
      unique: true,
      notNull: true,
    }
  }

  static columnWithNewId(defaultData: EntityColumn): EntityColumn {
    return {
      ...defaultData,
      id: ShortId.create(),
    }
  }

  static generateDefaultColumn(type: DIAGRAM.ENTITY.COLUMN_TYPE, entityId: string): EntityColumn {
    let column: EntityColumn = {
      ...DEFAULT_COLUMN_DATA,
      id: ShortId.create(),
      entityId,
    }

    if (type === DIAGRAM.ENTITY.COLUMN_TYPE.PRIMARY) {
      column = EntityUtils.primaryColumn(column)
    }

    return column
  }

  static getUpdatedEntityData(entity: EntityNode, dataUpdate: Partial<EntityNode['data']> | ((data: EntityNode['data']) => EntityNode)) {
    return {
      ...entity,
      data: {
        ...entity.data,
        ...typeof dataUpdate === "function" ? dataUpdate(entity.data) : dataUpdate
      }
    }
  }

  // New util functions for entity
  static updateData(updatedState: Partial<DiagramStore>, state: DiagramStore, entityId: string, data: Partial<EntityData> | ((data: EntityData) => Partial<EntityData>)) {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes
    }

    updatedState.nodes = updatedState.nodes.map(node => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node
      }
      if (node.id !== entityId) {
        return node
      }

      return {
        ...node,
        data: {
          ...node.data,
          ...typeof data === "function" ? data(node.data) : data
        }
      }
    })
  }
  static updateConfig(updatedState: Partial<DiagramStore>, state: DiagramStore, data: NODE.ENTITY.CONFIG_UPDATE['value']) {
    if (!updatedState.configs) {
      updatedState.configs = state.configs
    }

    if (updatedState.configs.find(c => c.userId === data.userId)) {
      updatedState.configs = updatedState.configs.map(c => {
        if (c.userId !== data.userId) {
          return c
        }
        return data
      })
    }

    updatedState.configs = [...updatedState.configs, data]
  }
  static updateName(updatedState: Partial<DiagramStore>, state: DiagramStore, data: NODE.ENTITY.NAME_UPDATE['value']) {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes
    }

    updatedState.nodes = updatedState.nodes.map(node => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node
      }
      if (node.id === data.id) {
        return {
          ...node,
          data: {
            ...node.data,
            name: data.name
          }
        }
      }
      return node
    })
  }

  static updateColor(updatedState: Partial<DiagramStore>, state: DiagramStore, data: NODE.ENTITY.COLOR_UPDATE['value']) {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes
    }

    updatedState.nodes = updatedState.nodes.map(node => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node
      }
      if (node.id === data.id) {
        return {
          ...node,
          data: {
            ...node.data,
            color: data.color
          }
        }
      }
      return node
    })
  }

  static addColumn(updatedState: Partial<DiagramStore>, state: DiagramStore, column: EntityColumn) {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes
    }

    updatedState.nodes = updatedState.nodes.map(node => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node
      }
      if (node.id === column.entityId) {
        return {
          ...node,
          data: {
            ...node.data,
            columns: [...node.data.columns, column]
          }
        }
      }
      return node
    })
  }

  static updateColumn(updatedState: Partial<DiagramStore>, state: DiagramStore, data: NODE.ENTITY.COLUMN_UPDATE['value']) {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes
    }

    updatedState.nodes = updatedState.nodes.map(node => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node
      }
      if (node.id === data.entityId) {
        return {
          ...node,
          data: {
            ...node.data,
            columns: node.data.columns.map(column => {
              if (column.id !== data.columnId) {
                return column
              }
              return {
                ...column,
                [data.key]: data.value
              }
            })
          }
        }
      }
      return node
    })
  }

  static deleteColumn(updatedState: Partial<DiagramStore>, state: DiagramStore, data: NODE.ENTITY.COLUMN_DELETE['value']) {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes
    }

    updatedState.nodes = updatedState.nodes.map(node => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node
      }

      for (const deleteColumn of data) {
        if (deleteColumn.entityId !== node.id) {
          continue
        }

        node = {
          ...node,
          data: {
            ...node.data,
            columns: node.data.columns.filter(column => column.id !== deleteColumn.columnId)
          }
        }
      }

      return node
    })
  }
}
