import {ITools} from "@/types/table-node";
import React from "react";
import {
  IconHandGrab,
  IconRelationManyToMany,
  IconRelationOneToMany,
  IconRelationOneToOne,
  IconTablePlus
} from "@tabler/icons-react";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import IconButton from "@/screens/Playground/Navbar/EntityControls/IconButton.tsx";

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
    label: 'Drag and place to add entity',
    value: 'add-table',
    icon: IconTablePlus,
    allowOnDisabled: true,
    onDragStart: (event) => {
      event.dataTransfer.setData('application/reactflow', "tableNode");
      event.dataTransfer.effectAllowed = 'move';
    }
  }, {
    label: 'One to one',
    value: 'one-to-one',
    icon: IconRelationOneToOne,
    allowOnDisabled: false
  }, {
    label: 'One to many',
    value: 'one-to-many',
    icon: IconRelationOneToMany,
    allowOnDisabled: false
  }, {
    label: 'Many to many',
    value: 'many-to-many',
    icon: IconRelationManyToMany,
    allowOnDisabled: false
  }]


export default function EntityControls() {
  const nodes = usePlaygroundStore(state => state.tables)
  const countOfNodesWithPrimaryKeys = nodes.reduce((count, node) => {
    const hasPrimary = node.data.columns.some(c => c.primary)

    return count + (hasPrimary ? 1 : 0)
  }, 0)
  const disabled = countOfNodesWithPrimaryKeys < 2
  
  return buttons.map(action => <IconButton key={action.value} disabled={disabled} data={action}/>)
  
}