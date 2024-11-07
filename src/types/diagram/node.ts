import {Node} from "@xyflow/react";
import {NODE_TYPES} from "@/screens/Diagram/Main/NodeTypes";

export interface EntityColumn {
  entityId: string;
  id: string;
  name: string;
  primary: boolean;
  type: string;
  foreignKey: boolean;
  notNull: boolean;
  unique: boolean;
  unsigned: boolean;
  autoIncrement: boolean;
  comment: string;
  selected: boolean;
}

export type EntityData = {
  name: string
  color: string
  columns: EntityColumn[]
}

export type EntityNode = Node<EntityData, NODE_TYPES.ENTITY>

export type NodeTypes = {
  entity: EntityNode
  memo: MemoNode
}

type MemoData = {
  content: string
  color: string
}

export type MemoNode = Node<MemoData, NODE_TYPES.MEMO>

export type NodeType = EntityNode | MemoNode
