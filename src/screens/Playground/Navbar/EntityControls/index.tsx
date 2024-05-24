import {EntityNode, ITools} from "@/types/entity-node";
import React, {useMemo} from "react";
import {
  IconHandGrab, IconNote,
  IconRelationManyToMany,
  IconRelationOneToMany,
  IconRelationOneToOne,
  IconTablePlus
} from "@tabler/icons-react";
import type {PlaygroundStore} from "@/stores/playgroundStore.ts";
import IconButton from "@/screens/Playground/Navbar/EntityControls/IconButton.tsx";
import {RELATION} from "@/constants/relations.ts";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";
import {Stack} from "@mantine/core";
import {useShallow} from "zustand/react/shallow";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

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

const selector = (state: PlaygroundStore) => ({
  entities: state.nodes.filter(node => node.type === NODE_TYPES.ENTITY) as EntityNode[],
})

export default function EntityControls() {
  const {entities} = usePlayground(useShallow(selector))
  const disabled = useMemo(() => {
    return entities.reduce((count, entity) => {
      const hasPrimary = entity.data.columns.some(c => c.primary)

      return count + (hasPrimary ? 1 : 0)
    }, 0) < 2
  }, [entities])

  return (
    <Stack gap={"5px"} px={"5px"}>
      {buttons.map(action => <IconButton key={action.value} disabled={disabled} data={action}/>)}
    </Stack>
  )

}
