export const KEYS = {
  erd: "erd"
}

export enum MULTIPLAYER_SOCKET {
  // Listeners
  ON_JOIN_ROOM="JOIN_ROOM",
  ON_LEAVE_ROOM="ON_LEAVE_ROOM",

  // Emmiters
  NEW_USER_JOINED="NEW_USER_JOINED",
  USER_LEFT="USER_LEFT"
}
