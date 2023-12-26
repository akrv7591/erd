import {Collapse, Table, Text} from "@mantine/core";
import React from "react";
import {useNodeData} from "@/hooks/useNodeData.ts";

const RenderList = React.memo(React.forwardRef<any, any>((props, ref) => {
  const data = useNodeData()
  return (
    <Table withRowBorders>
      <Table.Caption>
        <Collapse in={data.columns.length === 0}>
          <Text>No columns</Text>
        </Collapse>
      </Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Td w={40}></Table.Td>
          <Table.Td w={40}></Table.Td>
          <Table.Td w={40}></Table.Td>
          <Table.Td maw={200} miw={200}>Column</Table.Td>
          <Table.Td maw={150} miw={150} width={150}>Data type</Table.Td>
          <Table.Td miw={40}>PK</Table.Td>
          <Table.Td miw={40}>NN</Table.Td>
          <Table.Td miw={40}>UQ</Table.Td>
          <Table.Td miw={40}>UN</Table.Td>
          <Table.Td miw={40}>AI</Table.Td>
          <Table.Td miw={200}>Comment</Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody ref={ref}>
        {props.children}
      </Table.Tbody>
    </Table>
  )
}))


export default RenderList
