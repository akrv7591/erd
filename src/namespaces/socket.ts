export namespace SOCKET {
  export enum STATUS {
    OK = "status:ok",
    FAILED = "status:failed"
  }
  export enum USER {
    JOIN = "user:join",
    LEFT = "user:left"
  }

  export enum DATA {
    INITIAL_DATA = "data:initial-data",
    INITIAL_DATA_NOT_FOUND = "data:initial-data-not-found",
    UPDATE_DATA = "data:update-data",
  }
}
