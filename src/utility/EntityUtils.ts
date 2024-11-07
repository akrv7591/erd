import {EntityColumn, EntityNode} from "@/types/diagram";
import {createId} from "@paralleldrive/cuid2";
import {NODE_TYPES} from "@/screens/Diagram/Main/NodeTypes";
import {XYPosition} from "@xyflow/react";
import {DIAGRAM} from "@/namespaces";
import {DEFAULT_COLUMN_DATA} from "@/constants/diagram/column";

export class EntityUtils {
  static generateEntity(defaultData: EntityNode): EntityNode {
    if (!defaultData.id) {
      defaultData.id = createId()
    }

    return  defaultData
  }

  static genNewEntityNode(position: XYPosition) {
    const id = createId();
    const name = "Table"
    const node: EntityNode = {
      id,
      type: NODE_TYPES.ENTITY,
      position,
      data: {
        name,
        color: "#006ab9",
        columns: []
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
      id: createId(),
    }
  }

  static generateDefaultColumn(type: DIAGRAM.ENTITY.COLUMN_TYPE, entityId: string): EntityColumn {
    let column: EntityColumn = {
      ...DEFAULT_COLUMN_DATA,
      id: createId(),
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
}
