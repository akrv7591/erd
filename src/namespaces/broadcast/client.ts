import { XYPosition } from "@xyflow/react";

export namespace CLIENT {
  export namespace CURSOR {
    export enum TYPE {
      CHANGE = "client:cursor-change",
    }

    export type CHANGE = {
      type: TYPE.CHANGE
      value: {
        peerId: string;
        cursor: XYPosition | null;
      },
      server: boolean
    }

    export type DATA = CHANGE
  }

  export type TYPE = CURSOR.TYPE
  export type DATA = CURSOR.TYPE
}
