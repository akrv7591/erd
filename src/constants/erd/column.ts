import {IErdNodeColumn} from "../../types/erd-node";

export const DEFAULT_COLUMN_DATA: IErdNodeColumn = {
  id: "",
  column: "",
  dataType: "",
  primary: false,
  foreignKey: false,
  selected: false,
  notNull: false,
  unique: false,
  unsigned: false,
  autoIncrement: false,
  comment: ""
}
