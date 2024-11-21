import { EntityConfig } from "@/stores/diagram-store/slices/entity-slice/EntitySlice";
import { EntityColumn } from "@/types/diagram";

export namespace NODE {
  export namespace ENTITY {
    export enum TYPE {
      CONFIG_UPDATE = "entity:config-update",
      NAME_UPDATE = "entity:name-update",
      COLOR_UPDATE = "entity:color",
      COLUMN_ADD = "entity:column-add",
      COLUMN_UPDATE = "entity:column-update",
      COLUMN_DELETE = "entity:column-delete",
      COLUMN_ORDER_UPDATE = "entity:column-order-update",
    }

    export type CONFIG_UPDATE = {
      type: TYPE.CONFIG_UPDATE;
      value: EntityConfig;
    };

    export type NAME_UPDATE = {
      type: TYPE.NAME_UPDATE;
      value: {
        id: string;
        name: string;
      };
    };

    export type COLOR_UPDATE = {
      type: TYPE.COLOR_UPDATE;
      value: {
        id: string;
        color: string;
      };
    };

    export type COLUMN_ADD = {
      type: TYPE.COLUMN_ADD;
      value: EntityColumn[];
    };

    export type COLUMN_UPDATE = {
      type: TYPE.COLUMN_UPDATE;
      value: {
        entityId: string;
        changes: {
          id: string;
          key: keyof EntityColumn;
          value: string | number | boolean;
        }[];
      };
    };

    export type COLUMN_DELETE = {
      type: TYPE.COLUMN_DELETE;
      value: {
        entityId: string;
        ids: string[];
      };
    };

    export type COLUMN_ORDER_UPDATE = {
      type: TYPE.COLUMN_ORDER_UPDATE;
      value: {
        ids: string[];
        entityId: string;
      };
    };

    export type DATA =
      | CONFIG_UPDATE
      | NAME_UPDATE
      | COLOR_UPDATE
      | COLUMN_ADD
      | COLUMN_UPDATE
      | COLUMN_DELETE
      | COLUMN_ORDER_UPDATE;
  }

  export type TYPE = ENTITY.TYPE;
  export type DATA = ENTITY.DATA;
}
