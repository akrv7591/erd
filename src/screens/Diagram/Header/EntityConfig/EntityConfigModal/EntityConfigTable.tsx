import {ChangeEventHandler, forwardRef, memo, useCallback, useMemo} from "react";
import {EntityColumn} from "@/types/diagram";
import {Box, Center, Checkbox, Input, Table, Text, Tooltip} from "@mantine/core";
import {DragButton} from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Table/Row/DragButton";
import {TypeIcon} from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Table/Row/TypeIcon";
import {useEntityConfigContextForm,} from "@/screens/Diagram/Header/EntityConfig/EntityConfigModal/EntityContextForm";
import {ReactSortable} from "react-sortablejs";
import classes from "./style.module.css"

interface Props {
  columns: EntityColumn[]
  patchColumn: <K extends keyof EntityColumn>(id: EntityColumn['id'], key: K, column: EntityColumn[K]) => void

}

const {Thead, Tbody, Tr, Td} = Table

export const Header = forwardRef<any, any>((props, ref) => {
  const form = useEntityConfigContextForm()
  const {columns} = form.values

  const [isColumnsSelected, isAllSelected] = useMemo(() => {
    const isColumnsSelected = columns.some(column => column.selected)
    const isAllSelected = columns.length > 0 && columns.every(column => column.selected)
    return [isColumnsSelected, isAllSelected]
  }, [columns])

  const handleCheckboxValueChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    form.setValues(state => {
      return {
        ...state,
        columns: state.columns?.map(column => ({
          ...column,
          selected: e.target.checked
        }))
      }
    })
  }, [isColumnsSelected, isAllSelected])

  return (
    <Table withRowBorders>
      <Thead>
        <Tr>
          <Td w={40}></Td>
          <Td w={40}>
            <Checkbox
              indeterminate={isColumnsSelected && !isAllSelected}
              checked={isAllSelected}
              onChange={handleCheckboxValueChange}
            />
          </Td>
          <Td w={40}></Td>
          <Td w={150}>Column</Td>
          <Td w={150}>Data type</Td>
          <Td miw={40}><Tooltip position={"top"} label={"Primary key"}><Text>PK</Text></Tooltip></Td>
          <Td miw={40}><Tooltip position={"top"} label={"NOT NULL"}><Text>NN</Text></Tooltip></Td>
          <Td miw={40}><Tooltip position={"top"} label={"Unique"}><Text>UQ</Text></Tooltip></Td>
          <Td miw={40}><Tooltip position={"top"} label={"Unsigned"}><Text>UN</Text></Tooltip></Td>
          <Td miw={40}><Tooltip position={"top"} label={"Auto increment"}><Text>AI</Text></Tooltip></Td>
          <Td>Comment</Td>
        </Tr>
      </Thead>
      <Tbody ref={ref}>
        {props.children}
      </Tbody>
    </Table>
  )
})

interface RowProps {
  column: EntityColumn
  patchColumn: <K extends keyof EntityColumn>(id: EntityColumn['id'], key: K, column: EntityColumn[K]) => void
}

const Row = memo(({column, patchColumn}: RowProps) => {
  return (
    <Tr key={column.id}>
      <Td className={"nopan nodrag handle"}>
        <DragButton />
      </Td>
      <Td>
        <Checkbox
          checked={column.selected}
          onChange={(e) => patchColumn(column.id, 'selected', e.target.checked)}
        />
      </Td>
      <Td>
        <Center>
          <TypeIcon data={column}/>
        </Center>
      </Td>
      <Td>
        <Input
          value={column.name}
          variant={"filled"}
          placeholder={"Column name"}
          size={"sm"}
          onChange={e => patchColumn(column.id, 'name', e.target.value)}
        />
      </Td>
      <Td>
        <Input
          variant={"filled"}
          value={column.type}
          placeholder={"Data type"}
          size={"sm"}
          onChange={e => patchColumn(column.id, 'type', e.target.value)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={column.primary}
          onChange={(e) => patchColumn(column.id, 'primary', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={column.notNull}
          onChange={(e) => patchColumn(column.id, 'notNull', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={column.unique}
          onChange={(e) => patchColumn(column.id, 'unique', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={column.unsigned}
          onChange={(e) => patchColumn(column.id, 'unsigned', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={column.autoIncrement}
          onChange={(e) => patchColumn(column.id, 'autoIncrement', e.target.checked)}
        />
      </Td>
      <Td>
        <Input
          value={column.comment}
          placeholder={"Comment"}
          size={"sm"}
          variant={"filled"}
          onChange={e => patchColumn(column.id, 'comment', e.target.value)}
        />
      </Td>
    </Tr>
  )
})


export const EntityConfigTable = memo(({columns, patchColumn}: Props) => {
  const form = useEntityConfigContextForm()
  const handleSetOrderedList = useCallback((columns: EntityColumn[]) => {
    const orderedColumns = columns.map((column, index) => {
      return {
        ...column,
        order: index
      }
    })
    form.setFieldValue("columns", orderedColumns)
  }, [columns])

  return (
    <Box className={classes.tableContent}>
      <ReactSortable
        tag={Header}
        list={columns}
        className={classes.table}
        dragClass={classes.dragClass}
        ghostClass={classes.ghostClass}
        chosenClass={classes.chosenClass}
        setList={handleSetOrderedList}
        handle={".handle"}
      >
        {columns.map((row) => (
          <Row key={row.id} column={row} patchColumn={patchColumn}/>
        ))}
      </ReactSortable>
    </Box>
  )
})
