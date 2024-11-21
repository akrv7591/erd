import { EntityColumn, EntityData, EntityNode, NodeType } from "@/types/diagram";
import { NODE_TYPES } from "@/screens/Diagram/Main/NodeTypes";
import { XYPosition } from "@xyflow/react";
import { BROADCAST, DIAGRAM } from "@/namespaces";
import { DEFAULT_COLUMN_DATA } from "@/constants/diagram/column";
import { DiagramStore } from "@/stores/diagram-store";
import { NODE } from "@/namespaces/broadcast/node";
import { ShortId } from "@/utility/ShortId";

type StateUpdate<T extends BROADCAST.DATA> = (updatedState: Partial<DiagramStore>, state: DiagramStore, changes: T) => Partial<DiagramStore>

export class EntityUtils {
  static isEntityNode(nodeType: NodeType['type']) {
    return nodeType === NODE_TYPES.ENTITY
  }
  static genNewEntityNode(position: XYPosition, customData?: EntityNode["data"]) {
    const id = ShortId.create();
    const name = "Table";
    const defaultData = {
      name,
      color: "#006ab9",
      columns: [],
    };
    const data = customData ? customData : defaultData;

    const node: EntityNode = {
      id,
      type: NODE_TYPES.ENTITY,
      position,
      data: {
        ...data,
        columns: data.columns.map(column => ({
          ...column,
          id: ShortId.create(),
          entityId: id
        })),
      },
    };

    return node;
  }

  static primaryColumn(defaultData: EntityColumn): EntityColumn {
    return {
      ...defaultData,
      primary: true,
      unique: true,
      notNull: true,
    };
  }

  static generateDefaultColumn(
    type: DIAGRAM.ENTITY.COLUMN_TYPE,
    entityId: string,
  ): EntityColumn {
    let column: EntityColumn = {
      ...DEFAULT_COLUMN_DATA,
      id: ShortId.create(),
      entityId,
    };

    if (type === DIAGRAM.ENTITY.COLUMN_TYPE.PRIMARY) {
      column = EntityUtils.primaryColumn(column);
    }

    return column;
  }

  // New util functions for entity
  static updateData(
    updatedState: Partial<DiagramStore>,
    state: DiagramStore,
    entityId: string,
    data: Partial<EntityData> | ((data: EntityData) => Partial<EntityData>),
  ) {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes;
    }

    updatedState.nodes = updatedState.nodes.map((node) => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node;
      }
      if (node.id !== entityId) {
        return node;
      }

      return {
        ...node,
        data: {
          ...node.data,
          ...(typeof data === "function" ? data(node.data) : data),
        },
      };
    });
  }

  static updateConfig(
    updatedState: Partial<DiagramStore>,
    state: DiagramStore,
    data: NODE.ENTITY.CONFIG_UPDATE["value"],
  ) {
    if (!updatedState.configs) {
      updatedState.configs = state.configs;
    }

    if (updatedState.configs.find((c) => c.userId === data.userId)) {
      updatedState.configs = updatedState.configs.map((c) => {
        if (c.userId !== data.userId) {
          return c;
        }
        return data;
      });
    }

    updatedState.configs = [...updatedState.configs, data];
  }

  static updateName: StateUpdate<NODE.ENTITY.NAME_UPDATE> = (updatedState, state, {value}) => {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes;
    }

    updatedState.nodes = updatedState.nodes.map((node) => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node;
      }

      if (node.id !== value.id) {
        return node;
      }

      return {
        ...node,
        data: {
          ...node.data,
          name: value.name,
        },
      };

    });

    return updatedState
  }

  static updateColor: StateUpdate<NODE.ENTITY.COLOR_UPDATE> = (updatedState, state, {value}) =>{
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes;
    }

    updatedState.nodes = updatedState.nodes.map((node) => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node;
      }

      if (node.id !== value.id) {
        return node;
      }

      return {
        ...node,
        data: {
          ...node.data,
          color: value.color,
        },
      };
    });

    return updatedState
  }

  static addColumn: StateUpdate<NODE.ENTITY.COLUMN_ADD> = (updatedState, state, {value: columns}) => {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes;
    }

    updatedState.nodes = updatedState.nodes.map((node) => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node;
      }

      const entityColumns = columns.filter(column => column.entityId === node.id)

      if (!entityColumns.length) {
        return node
      }

      return {
        ...node,
        data: {
          ...node.data,
          columns: [...node.data.columns, ...entityColumns],
        },
      };
    });

    return updatedState
  }

  static updateColumn: StateUpdate<NODE.ENTITY.COLUMN_UPDATE> = (updatedState, state, {value}) => {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes;
    }

    updatedState.nodes = updatedState.nodes.map((node) => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node;
      }
      if (node.id !== value.entityId) {
        return node
      }

      return {
        ...node,
        data: {
          ...node.data,
          columns: node.data.columns.map((column) => {
            const change = value.changes.find(change => change.id === column.id)

            if (!change) {
              return column
            }

            return {
              ...column,
              [change.key]: change.value,
            };
          }),
        },
      };
    });

    return updatedState
  }

  static deleteColumn: StateUpdate<NODE.ENTITY.COLUMN_DELETE> = (updatedState, state, {value}) => {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes;
    }


    updatedState.nodes = updatedState.nodes.map((node) => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node;
      }

      if (node.id !== value.entityId) {
        return node
      }

      return {
        ...node,
        data: {
          ...node.data,
          columns: node.data.columns.filter(column => !value.ids.includes(column.id))
        },
      };
    });

    return updatedState
  }

  static updateColumnOrder: StateUpdate<NODE.ENTITY.COLUMN_ORDER_UPDATE> = (updatedState, state, { value }) => {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes;
    }

    updatedState.nodes = updatedState.nodes.map(node => {
      if (node.type !== NODE_TYPES.ENTITY) {
        return node
      }

      if (node.id !== value.entityId) {
        return node
      }

      const tempObj = Object.fromEntries(node.data.columns.map(column => ([column.id, column])))

      return {
        ...node,
        data: {
          ...node.data,
          columns: value.ids.map(id => tempObj[id])
        }
      }
    })

    return updatedState
  }
}
