import {EntityColumn, EntityNode} from "@/providers/shared-diagram-store-provider/type.ts";
import {createId} from "@paralleldrive/cuid2";
import {COLUMN_TYPE, DEFAULT_COLUMN_DATA} from "@/constants/erd/column.ts";

export class EntityUtils {
  static generateEntity(defaultData: EntityNode): EntityNode {
    if (!defaultData.id) {
      defaultData.id = createId()
    }

    return  defaultData
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

  static generateDefaultColumn(type: COLUMN_TYPE, entityId: string, order: number): EntityColumn {
    let column: EntityColumn = {
      ...DEFAULT_COLUMN_DATA,
      id: createId(),
      entityId,
      order,
    }

    if (type === COLUMN_TYPE.PRIMARY) {
      column = EntityUtils.primaryColumn(column)
    }

    return column
  }
}
