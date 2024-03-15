import {ITools} from "@/types/entity-node";
import React from "react";
import {
  IconHandGrab, IconNote,
  IconRelationManyToMany,
  IconRelationOneToMany,
  IconRelationOneToOne,
  IconTablePlus
} from "@tabler/icons-react";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import IconButton from "@/screens/Playground/Navbar/EntityControls/IconButton.tsx";
import {RELATION} from "@/constants/relations.ts";

export interface IData {
  label: string
  value: ITools
  icon: any
  onDragStart?: React.DragEventHandler<HTMLButtonElement>
  allowOnDisabled: boolean
}

const buttons: IData[] = [
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
      event.dataTransfer.setData('application/reactflow', "entityNode");
      event.dataTransfer.effectAllowed = 'move';
    }
  }, {
    label: 'Drag and drop to add memo',
    value: 'add-memo',
    icon: IconNote,
    allowOnDisabled: true,
    onDragStart: (event) => {
      event.dataTransfer.setData('application/reactflow', "memoNode");
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


export default function EntityControls() {
  const entities = usePlaygroundStore(state => state.entities)
  const countOfNodesWithPrimaryKeys = entities.reduce((count, entity) => {
    const hasPrimary = entity.data.columns.some(c => c.primary)

    return count + (hasPrimary ? 1 : 0)
  }, 0)
  const disabled = countOfNodesWithPrimaryKeys < 2

  return buttons.map(action => <IconButton key={action.value} disabled={disabled} data={action}/>)

}
