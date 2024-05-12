export enum Key {
  playgrounds = "playgrounds",
  subscribers = "subscribers",
  entities = "entities",
  nodes = "nodes",
  position = "position",
}

export enum ErdEnum {
  patch = "erd:patch",
  put = "erd:put",
  delete = "erd:delete",
}

export enum MemoEnum {
  add = "memo:add",
  patch = "memo:patch",
  delete = "memo:delete",
}

export enum EntityEnum {
  add = "entity:add",
  patch = "entity:patch",
  delete = "entity:delete",
}

export enum ColumnEnum {
  add = "column:add",
  patch = "column:patch",
  update = "column:update",
  delete = "column:delete",
}

export enum PlayerEnum {
  join = "player:join",
  leave = "player:leave",
  subscribe = "player:subscribe",
  unsubscribe = "player:unsubscribe",
  viewpointChange = "player:viewpointChange",
  mouseChange = "player:mouseChange",
}

export enum RelationEnum {
  add = "relation:add",
  delete = "relation:delete",
}

export enum NodeEnum {
  add = "node:add",
  delete = "node:delete",
  patchPositions = "node:patchPositions",
}

export type Playground = PlayerEnum | EntityEnum | RelationEnum | ColumnEnum | ErdEnum | MemoEnum

export enum CallbackDataStatus {
  OK="ok",
  FAILED="failed",
}

export enum EntityViewMode {
  LOGICAL = "logical",
  EDITOR = "editor",
}
