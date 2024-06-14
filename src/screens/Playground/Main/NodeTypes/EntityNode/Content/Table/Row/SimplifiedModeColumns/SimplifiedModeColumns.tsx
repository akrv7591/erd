import {FC, memo} from "react";
import {EntityNodeColumn} from "@/types/entity-node";
import styles from "@/screens/Playground/Main/NodeTypes/EntityNode/Content/Table/style.module.css";
import {Center, Input, Table} from "@mantine/core";
import {TypeIcon} from "@/screens/Playground/Main/NodeTypes/EntityNode/Content/Table/Row/TypeIcon";
import {usePatchColumn} from "@/hooks/usePatchColumn.ts";

interface Props {
  data: Pick<EntityNodeColumn, 'id' | 'name' | 'type' | 'primary' | 'foreignKey'>
}

const {Tr, Td} = Table

export const SimplifiedModeColumns: FC<Props> = memo(({data}) => {
  const {patchColumn} = usePatchColumn(data.id)

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
