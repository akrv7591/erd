import {IErdNodeColumn} from "@/types/erd-node";

export const DEFAULT_COLUMN_DATA: IErdNodeColumn = {
  id: "",
  tableId: "",
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
