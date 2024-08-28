import {FC, memo, useCallback} from "react";
import styles from "@/screens/Playground/Main/NodeTypes/EntityNode/Content/Table/style.module.css";
import {Center, Input, Table} from "@mantine/core";
import {TypeIcon} from "@/screens/Playground/Main/NodeTypes/EntityNode/Content/Table/Row/TypeIcon";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import {EntityColumn} from "@/providers/shared-diagram-store-provider/type.ts";

interface Props {
  data: EntityColumn
}

const {Tr, Td} = Table

export const SimplifiedModeColumns: FC<Props> = memo(({data}) => {
  const setColumnData = useSharedDiagramStore(state => state.setColumnData)

  const patchColumn = useCallback((key: keyof EntityColumn, value: string) => {
    setColumnData(data.entityId, data.id, {
      [key]: value
    })
  }, [])

  return (
    <Tr className={styles.tableRow}>
      <Td>
        <Center>
          <TypeIcon data={data}/>
        </Center>
      </Td>
      <Td>
        <Input
          value={data.name}
          size={"sm"}
          variant={"filled"}
          placeholder={"Column name"}
          onChange={e => patchColumn('name', e.target.value)}
        />
      </Td>
      <Td>
        <Input
          value={data.type}
          placeholder={"Data type"}
          variant={"filled"}
          size={"sm"}
          miw={"200px"}
          onChange={e => patchColumn('type', e.target.value)}
        />
      </Td>
    </Tr>
  )
})
