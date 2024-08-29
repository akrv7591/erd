import {memo} from "react";
import {EntityColumn} from "@/providers/shared-diagram-store-provider/type.ts";
import {Center, Checkbox, Input, Table, Text, Tooltip} from "@mantine/core";
import {DragButton} from "@/screens/Playground/Main/NodeTypes/EntityNode/Content/Table/Row/DragButton";
import {TypeIcon} from "@/screens/Playground/Main/NodeTypes/EntityNode/Content/Table/Row/TypeIcon";

interface Props {
  columns: EntityColumn[]
  patchColumn: <K extends keyof EntityColumn>(id: EntityColumn['id'], key: K, column: EntityColumn[K]) => void
}

const {Thead, Tbody, Tr, Td} = Table

export const EntityConfigTable = memo(({columns, patchColumn}: Props) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Td w={40}></Td>
          <Td w={40}>
            <Checkbox
              // indeterminate={checkbox.isIntermediate}
              // checked={checkbox.isAllChecked}
              // onChange={() => {}}
              // onClick={onCheckboxClick}
            />
          </Td>
          <Td w={40}></Td>
          <Td>Column</Td>
          <Td w={150}>Data type</Td>
          <Td miw={40}><Tooltip position={"top"} label={"Primary key"}><Text>PK</Text></Tooltip></Td>
          <Td miw={40}><Tooltip position={"top"} label={"NOT NULL"}><Text>NN</Text></Tooltip></Td>
          <Td miw={40}><Tooltip position={"top"} label={"Unique"}><Text>UQ</Text></Tooltip></Td>
          <Td miw={40}><Tooltip position={"top"} label={"Unsigned"}><Text>UN</Text></Tooltip></Td>
          <Td miw={40}><Tooltip position={"top"} label={"Auto increment"}><Text>AI</Text></Tooltip></Td>
          <Td miw={200}>Comment</Td>
        </Tr>
      </Thead>
      <Tbody>
        {!columns.length && (
          <Tr>
            <Td colSpan={11}>
              <Text style={{textAlign: "center"}}>No rows available</Text>
            </Td>
          </Tr>
        )}
        {columns.map(column => (
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
        ))}
      </Tbody>
    </Table>
  )
})
