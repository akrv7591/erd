import {EntityColumn} from "@/providers/shared-diagram-store-provider/type.ts";

export enum COLUMN_TYPE {
  PRIMARY = "primary",
  DEFAULT = "default",
}

export const DEFAULT_COLUMN_DATA: Omit<EntityColumn, 'id' | 'order' | 'entityId'> = {
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
