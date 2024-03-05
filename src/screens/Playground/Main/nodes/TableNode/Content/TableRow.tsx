import {ActionIcon, Center, Checkbox, Input, Table} from "@mantine/core";
import {IconGripVertical} from "@tabler/icons-react";
import React, {useCallback, useMemo} from "react";
import styles from "./style.module.css"
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {Column} from "@/enums/playground.ts";
import {useNodeId} from "@xyflow/react";
import {ITableNodeColumn} from "@/types/table-node";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import ColumnTypeIcon from "@/screens/Playground/Main/nodes/TableNode/Content/ColumnTypeIcon.tsx";

const TableRow = React.memo(({data}: { data: ITableNodeColumn }) => {
  const playground = usePlayground()
  const tableId = useNodeId()
  const highlightedRelation = usePlaygroundStore(state => state.highlightedRelation)

  if (!tableId) return null

  const setData = useCallback((key: string, value: any) => {
    playground.column(Column.update, {
      id: data.id,
      key,
      value,
      tableId
    })
  }, [playground])

  const highlighted = useMemo(() => {
    if (highlightedRelation?.endNodeColumnId === data.id) {
      return true
    } else return highlightedRelation?.startNodeId === tableId && data.primary;
  }, [highlightedRelation])

  return (
    <Table.Tr className={`${styles.tableRow} ${highlighted ? styles.border : ""}`}>
      <Table.Td className={"nopan nodrag handle"}>
        <ActionIcon variant={"transparent"}>
          <IconGripVertical stroke={1} data-movable-handle/>
        </ActionIcon>
      </Table.Td>
      <Table.Td>
        <Checkbox checked={data.selected} onChange={(e) => setData('selected', e.target.checked)}/>
      </Table.Td>
      <Table.Td>
        <Center>
          <ColumnTypeIcon data={data}/>
        </Center>
      </Table.Td>
      <Table.Td>
        <Input
          value={data.name}
          styles={{
            input: {
              backgroundColor: "var(--mantine-color-dark-5)"
            }
          }}
          size={"sm"}
          variant={"filled"}
          placeholder={"Column name"}
          onChange={e => setData('name', e.target.value)}
        />
      </Table.Td>
      <Table.Td>
        <Input
          value={data.type}
          placeholder={"Data type"}
          variant={"filled"}
          size={"sm"}
          miw={"200px"}
          onChange={e => setData('type', e.target.value)}
        />
      </Table.Td>
      <Table.Td>
        <Checkbox checked={data.primary} onChange={(e) => setData('primary', e.target.checked)}/>
      </Table.Td>
      <Table.Td>
        <Checkbox checked={data.null} onChange={(e) => setData('null', e.target.checked)}/>
      </Table.Td>
      <Table.Td>
        <Checkbox checked={data.unique} onChange={(e) => setData('unique', e.target.checked)}/>
      </Table.Td>
      <Table.Td>
        <Checkbox checked={data.unsigned} onChange={(e) => setData('unsigned', e.target.checked)}/>
      </Table.Td>
      <Table.Td>
        <Checkbox checked={data.autoIncrement} onChange={(e) => setData('autoIncrement', e.target.checked)}/>
      </Table.Td>
      <Table.Td>
        <Input
          value={data.comment}
          placeholder={"Comment"}
          size={"sm"}
          variant={"filled"}
          onChange={e => setData('comment', e.target.value)}
        />
      </Table.Td>

    </Table.Tr>
  )


})

export default TableRow
