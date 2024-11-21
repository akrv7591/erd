import { StateCreator } from "zustand";
import { DiagramStore } from "@/stores/diagram-store";
import { EntityNode } from "@/types/diagram";
import { NODE } from "@/namespaces/broadcast/node";
import { RelationUtils } from "@/utility/RelationUtils";
import { BROADCAST, RELATION } from "@/namespaces";
import { REACTFLOW } from "@/namespaces/broadcast/reactflow";

export type EntityConfig = EntityNode["data"] & {
  userId: string;
};

interface EntityState {
  configs: EntityConfig[];
}
interface EntityAction {
  updateEntityConfig: (data: NODE.ENTITY.CONFIG_UPDATE["value"]) => void;
  handleEntityToEntityConnection: (
    sourceEntity: EntityNode,
    targetEntity: EntityNode,
  ) => void;
}

export type EntitySlice = EntityState & EntityAction;

const initState: EntityState = {
  configs: [],
};

export const entitySlice: StateCreator<DiagramStore, [], [], EntitySlice> = (
  set,
  get,
  api,
) => ({
  ...initState,
  updateEntityConfig: (config) =>
    set((state) => {
      const userConfig = state.configs.find((c) => c.userId === config.userId);

      state.socket.broadcastData([
        {
          type: NODE.ENTITY.TYPE.CONFIG_UPDATE,
          value: config,
        },
      ]);

      if (userConfig) {
        return {
          configs: state.configs.map((c) => {
            if (c.userId !== config.userId) {
              return c;
            }
            return config;
          }),
        };
      }

      return {
        configs: [...state.configs, config],
      };
    }),

  handleEntityToEntityConnection: (sourceEntity, targetEntity) => {
    set((state) => {

      const { newEntities, newRelations, newTargetNodeColumns } =
        RelationUtils.generateEntityConnectData({
          sourceEntity,
          targetEntity,
          relationType: state.tool as RELATION.NAME,
        });

      const updates: BROADCAST.DATA[] = [];
      const current: BROADCAST.DATA[] = [];

      if (newEntities.length) {
        updates.push({
          type: REACTFLOW.TYPE.NODE_CHANGE,
          value: newEntities.map((item) => ({
            type: "add",
            item,
          })),
        });

        current.push(({
          type: REACTFLOW.TYPE.NODE_CHANGE,
          value: newEntities.map(entity => ({
            type: "remove",
            id: entity.id
          }))
        }))
      }

      if (newTargetNodeColumns.length) {
        updates.push({
          type: NODE.ENTITY.TYPE.COLUMN_ADD,
          value: newTargetNodeColumns
        })

        current.push({
          type: NODE.ENTITY.TYPE.COLUMN_DELETE,
          value: {
            entityId: targetEntity.id,
            ids: newTargetNodeColumns.map(column => column.id)
          }
        })
      }

      if (newRelations.length) {
        updates.push({
          type: REACTFLOW.TYPE.EDGE_CHANGE,
          value: newRelations.map(item => ({
            type: "add",
            item
          }))
        })

        current.push({
          type: REACTFLOW.TYPE.EDGE_CHANGE,
          value: newRelations.map(relation => ({
            type: "remove",
            id: relation.id
          }))
        })
      }

      state.handleDataChange({
        updates,
        current,
      })

      return {
        tool: "hand-grab"
      }
    });
  },
});
