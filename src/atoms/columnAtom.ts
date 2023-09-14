import {atom, PrimitiveAtom} from "jotai";
import {v4} from "uuid";

export interface IColumn {
  id: string;
  column: string;
  primary: boolean;
  dataType: string;
  foreignKey: boolean;
  selected: boolean;
  notNull: boolean;
  unique: boolean;
  unsigned: boolean;
  autoIncrement: boolean;
  comment: string;
}

export type ColumnType = "primary" | "foreign-key" | "default"

export const DEFAULT_COLUMN_DATA: IColumn = {
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

const setTypes = (type: ColumnType) => {
  const data = {...DEFAULT_COLUMN_DATA}

  switch (type) {
    case "foreign-key":
      data.foreignKey = true
      break
    case "primary":
      data.primary = true
      break
    case "default":
      break
  }

  return data
}

export const getColumAtom = (type: ColumnType) => atom<IColumn>({...setTypes(type), id: v4()})
export interface IColumnAtom extends PrimitiveAtom<IColumn> {}
