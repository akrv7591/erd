import {EntityNodeColumn} from "@/types/entity-node";

export const DEFAULT_COLUMN_DATA: EntityNodeColumn = {
  id: "",
  entityId: "",
  name: "",
  type: "",
  primary: false,
  foreignKey: false,
  selected: false,
  null: false,
  unique: false,
  unsigned: false,
  autoIncrement: false,
  comment: "",
  order: 0
}
