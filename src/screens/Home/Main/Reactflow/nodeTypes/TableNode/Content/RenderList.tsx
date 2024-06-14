import {Table} from "@mantine/core";
import React from "react";
import {useErdTableData} from "@/screens/Home/Main/Reactflow/ErdTableDataContext.ts";
import {Collapse, Text} from "@mantine/core";

const RenderList = React.forwardRef<any, any>((props, ref) => {
  const {data} = useErdTableData()
  return (
    <Table withRowBorders>
      <Table.Caption>
        <Collapse in={data.columns.length === 0}>
          <Text>No rows</Text>
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
})


export default RenderList
