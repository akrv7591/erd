export enum Key {
  playground = "playground",
  subscribe = "subscribe",
  table = "table",
}

export enum ErdEnum {
  patch = "erd:patch",
  put = "erd:put",
  delete = "erd:delete",
}

export enum PlayerEnum {
  join = "player:join",
  leave = "player:leave",
  subscribe = "player:subscribe",
  unsubscribe = "player:unsubscribe",
  viewpointChange = "player:viewpointChange",
  mouseChange = "player:mouseChange",
}

export enum EntityEnum {
  add = "entity:add",
  update = "entity:update",
  delete = "entity:delete",
  set = "entity:set",
}

export enum RelationEnum {
  add = "relation:add",
  delete = "relation:delete",
}

export enum ColumnEnum {
  add = "column:add",
  update = "column:update",
  delete = "column:delete",
}

export enum MemoEnum {
  add = "memo:add",
  put = "memo:put",
  patch = "memo:patch",
  delete = "memo:delete",
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
