import { useDiagramStore } from "./useDiagramStore";
import { useCallback, useMemo } from "react";
import { EntityColumn } from "@/types/diagram";
import { NODE } from "@/namespaces/broadcast/node";
import { useNodeId } from "@xyflow/react";

type ColumnUpdate = NODE.ENTITY.COLUMN_UPDATE["value"]["changes"];

export const useEntityColumns = () => {
  const handleDataChange = useDiagramStore(state => state.handleDataChange);
  const entityId = useNodeId();

  if (!entityId) {
    throw new Error(
      "useEntityColumns should be used in EntityComponent component",
    );
  }

  const addColumns = useCallback((columns: EntityColumn[]) => {
    const current: NODE.ENTITY.COLUMN_DELETE[] = [{
      type: NODE.ENTITY.TYPE.COLUMN_DELETE,
      value: {
        entityId,
        ids: columns.map((column) => column.id),
      },
    }];

    const updates: NODE.ENTITY.COLUMN_ADD[] = [
      {
        type: NODE.ENTITY.TYPE.COLUMN_ADD,
        value: columns,
      },
    ];

    handleDataChange({
      updates,
      current
    })

  }, []);

  const deleteColumns = useCallback((columns: EntityColumn[]) => {
    const current: NODE.ENTITY.COLUMN_ADD[] = [{
      type: NODE.ENTITY.TYPE.COLUMN_ADD,
      value: columns,
    }];

    const updates: NODE.ENTITY.COLUMN_DELETE[] = [
      {
        type: NODE.ENTITY.TYPE.COLUMN_DELETE,
        value: {
          entityId,
          ids: columns.map((column) => column.id),
        },
      },
    ];
    handleDataChange({
      updates,
      current
    })
  }, []);

  const updateColumn = useCallback(
    (old: ColumnUpdate, updated: ColumnUpdate) => {
      const current: NODE.ENTITY.COLUMN_UPDATE[] = [{
        type: NODE.ENTITY.TYPE.COLUMN_UPDATE,
        value: {
          entityId,
          changes: old.map((o) => ({
            id: o.id,
            key: o.key,
            value: o.value,
          })),
        },
      }];

      const updates: NODE.ENTITY.COLUMN_UPDATE[] = [
        {
          type: NODE.ENTITY.TYPE.COLUMN_UPDATE,
          value: {
            entityId,
            changes: updated.map((u) => ({
              id: u.id,
              key: u.key,
              value: u.value,
            })),
          },
        },
      ];

      handleDataChange({
        updates,
        current
      })
    },
    [],
  );

  const updateColumnsOrder = useCallback((old: string[], updated: string[]) => {
    const current: NODE.ENTITY.COLUMN_ORDER_UPDATE[] = [{
      type: NODE.ENTITY.TYPE.COLUMN_ORDER_UPDATE,
      value: {
        entityId,
        ids: old,
      },
    }];
    const updates: NODE.ENTITY.COLUMN_ORDER_UPDATE[] = [
      {
        type: NODE.ENTITY.TYPE.COLUMN_ORDER_UPDATE,
        value: {
          entityId,
          ids: updated,
        },
      },
    ];

    handleDataChange({
      updates,
      current
    })
  }, []);

  return useMemo(
    () => ({
      addColumns,
      deleteColumns,
      updateColumn,
      updateColumnsOrder,
    }),
    [],
  );
};
