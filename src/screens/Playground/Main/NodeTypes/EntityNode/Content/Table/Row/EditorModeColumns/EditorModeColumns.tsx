import {FC, memo, useCallback} from "react";
import styles from "@/screens/Playground/Main/NodeTypes/EntityNode/Content/Table/style.module.css";
import {DragButton} from "@/screens/Playground/Main/NodeTypes/EntityNode/Content/Table/Row/DragButton";
import {Center, Checkbox, Input, Table} from "@mantine/core";
import {TypeIcon} from "@/screens/Playground/Main/NodeTypes/EntityNode/Content/Table/Row/TypeIcon";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import {EntityColumn} from "@/providers/shared-diagram-store-provider/type.ts";

const {Td, Tr} = Table

interface Props {
  data: EntityColumn
}

export const EditorModeColumns: FC<Props> = memo(({data}) => {
  const setColumnData = useSharedDiagramStore(state => state.setColumnData)
  const patchColumn = useCallback((key: keyof EntityColumn, value: string | number | boolean) => {
    setColumnData(data.entityId, data.id, {
      [key]: value
    })
  }, [])

  return (
    <Tr className={styles.tableRow}>
      <Td className={"nopan nodrag handle"}>
        <DragButton />
      </Td>
      <Td>
        <Checkbox
          checked={data.selected}
          onChange={(e) => patchColumn('selected', e.target.checked)}
        />
      </Td>
      <Td>
        <Center>
          <TypeIcon data={data}/>
        </Center>
      </Td>
      <Td>
        <Input
          value={data.name}
          variant={"filled"}
          placeholder={"Column name"}
          size={"sm"}
          onChange={e => patchColumn('name', e.target.value)}
        />
      </Td>
      <Td>
        <Input
          variant={"filled"}
          value={data.type}
          placeholder={"Data type"}
          size={"sm"}
          onChange={e => patchColumn('type', e.target.value)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.primary}
          onChange={(e) => patchColumn('primary', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.notNull}
          onChange={(e) => patchColumn('notNull', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.unique}
          onChange={(e) => patchColumn('unique', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.unsigned}
          onChange={(e) => patchColumn('unsigned', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.autoIncrement}
          onChange={(e) => patchColumn('autoIncrement', e.target.checked)}
        />
      </Td>
      <Td>
        <Input
          value={data.comment}
          placeholder={"Comment"}
          size={"sm"}
          variant={"filled"}
          onChange={e => patchColumn('comment', e.target.value)}
        />
      </Td>
    </Tr>
  )
})
