import {EntityColumn} from "@/types/diagram";

export const DEFAULT_COLUMN_DATA: Omit<EntityColumn, 'id' | 'entityId'> = {
  name: "",
  type: "",
  primary: false,
  foreignKey: false,
  notNull: true,
  unique: false,
  unsigned: false,
  autoIncrement: false,
  comment: "",
  selected: false,
}
