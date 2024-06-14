import {
  IconHandGrab,
  IconNote,
  IconRelationManyToMany,
  IconRelationOneToMany,
  IconRelationOneToOne,
  IconTablePlus
} from "@tabler/icons-react";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {RELATION} from "@/constants/relations.ts";
import type {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {EntityNode} from "@/types/entity-node";
import {EntityControl} from "./types";

export const EntityActions: EntityControl[] = [
  {
    label: 'Hand grab',
    value: 'hand-grab',
    icon: IconHandGrab,
    allowOnDisabled: true
  }, {
    label: 'Drag and drop to add entity',
    value: 'add-table',
    icon: IconTablePlus,
    allowOnDisabled: true,
    onDragStart: (event) => {
      event.dataTransfer.setData('application/reactflow', NODE_TYPES.ENTITY);
      event.dataTransfer.effectAllowed = 'move';
    }
  }, {
    label: 'Drag and drop to add memo',
    value: 'add-memo',
    icon: IconNote,
    allowOnDisabled: true,
    onDragStart: (event) => {
      event.dataTransfer.setData('application/reactflow', NODE_TYPES.MEMO);
      event.dataTransfer.effectAllowed = 'move';
    }
  }, {
    label: 'One to one',
    value: RELATION.NAME.ONE_TO_ONE,
    icon: IconRelationOneToOne,
    allowOnDisabled: false
  }, {
    label: 'One to many',
    value: RELATION.NAME.ONE_TO_MANY,
    icon: IconRelationOneToMany,
    allowOnDisabled: false
  }, {
    label: 'Many to many',
    value: RELATION.NAME.MANY_TO_MANY,
    icon: IconRelationManyToMany,
    allowOnDisabled: false
  }]

export const selector = (state: PlaygroundStore) => ({
  entities: state.nodes.filter(node => node.type === NODE_TYPES.ENTITY) as EntityNode[],
})
