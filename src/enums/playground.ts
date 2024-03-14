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

export enum Player {
  join = "player:join",
  leave = "player:leave",
  subscribe = "player:subscribe",
  unsubscribe = "player:unsubscribe",
  viewpointChange = "player:viewpointChange",
  mouseChange = "player:mouseChange",
}

export enum Entity {
  add = "entity:add",
  update = "entity:update",
  delete = "entity:delete",
  set = "entity:set",
}

export enum Relation {
  add = "relation:add",
  delete = "relation:delete",
}

export enum Column {
  add = "column:add",
  update = "column:update",
  delete = "column:delete",
}

export type Playground = Player | Entity | Relation | Column | ErdEnum

export enum CallbackDataStatus {
  OK="ok",
  FAILED="failed",
}
