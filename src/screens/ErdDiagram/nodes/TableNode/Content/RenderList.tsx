import {RenderListParams} from "react-movable";
import {Collapse, Table, Text} from "@mantine/core";
import React from "react";

interface Props extends RenderListParams {
  rowLength: number
}

const RenderList = React.memo(({isDragged, children, props, rowLength}: Props) => {
  return (
    <Table style={{cursor: isDragged ? "grab" : undefined,}} withRowBorders >
          <Table.Caption>
            <Collapse in={!rowLength}>

              <Text>No columns</Text>
            </Collapse>

          </Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Td w={40}></Table.Td>
          <Table.Td w={40}></Table.Td>
          <Table.Td w={40}></Table.Td>
          <Table.Td maw={200} miw={200}>Column</Table.Td>
          <Table.Td maw={200} miw={200}>Data type</Table.Td>
          <Table.Td miw={40}>PK</Table.Td>
          <Table.Td miw={40}>NN</Table.Td>
          <Table.Td miw={40}>UQ</Table.Td>
          <Table.Td miw={40}>UN</Table.Td>
          <Table.Td miw={40}>AI</Table.Td>
          <Table.Td miw={200}>Comment</Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody {...props}>
        {children}
      </Table.Tbody>
    </Table>
  )
})


export default RenderList
