import {EntityNodeColumn} from "@/types/entity-node";

export const DEFAULT_COLUMN_DATA: Omit<EntityNodeColumn, 'id' | 'order' | 'entityId'> = {
  name: "",
  type: "",
  primary: false,
  foreignKey: false,
  selected: false,
  notNull: true,
  unique: false,
  unsigned: false,
  autoIncrement: false,
  comment: "",
}
