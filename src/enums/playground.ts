
export enum Key {
  playground = "playground",
  subscribe = "subscribe",
  table = "table",
}

export enum Player {
  join = "player:join",
  leave = "player:leave",
  subscribe = "player:subscribe",
  unsubscribe = "player:unsubscribe",
  viewpointChange = "player:viewpointChange",
  mouseChange = "player:mouseChange",
}

export enum Table {
  add = "table:add",
  update = "table:update",
  delete = "table:delete",
  set = "table:set",
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

export type Playground = Player | Table | Relation | Column

export enum CallbackDataStatus {
  OK="ok",
  FAILED="failed",
}
