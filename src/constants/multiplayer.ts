export const KEYS = {
  erd: "erd"
}

export enum MULTIPLAYER_SOCKET {
  ADD_PLAYER="ADD_PLAYER",
  REMOVE_PLAYER="REMOVE_PLAYER",
  SUBSCRIBE_TO_PLAYER = "SUBSCRIBE_TO_PLAYER",
  UNSUBSCRIBE_TO_PLAYER = "UNSUBSCRIBE_TO_PLAYER",
  ON_USER_VIEWPORT_CHANGE = "ON_USER_VIEWPORT_CHANGE",
  ON_USER_MOUSE_CHANGE = "ON_USER_MOUSE_CHANGE",
  ADD_TABLE="ONA_ADD_TABLE",
  UPDATE_TABLE="UPDATE_TABLE",
  DELETE_TABLE="DELETE_TABLE",
  SUBSCRIBE_TO_TABLE_DATE="SUBSCRIBE_TO_TABLE_DATE",
  ADD_TABLE_COLUMN="ADD_TABLE_COLUMN",
  UPDATED_TABLE_COLUMN="UPDATED_TABLE_COLUMN",
  DELETE_TABLE_COLUMN="DELETE_TABLE_COLUMN",
  SET_TABLE_DATA="SET_TABLE_DATA",
  ADD_RELATION = "ADD_RELATION",
  DELETE_RELATION = "DELETE_RELATION"
}
