import {RELATION} from "@/namespaces";

export type Client = {
  id: string
  userId: string,
  cursor: { x: number, y: number } | null
  color: string
}

export type Tools = 'hand-grab' | 'add-table' | 'add-memo' | RELATION.NAME;
