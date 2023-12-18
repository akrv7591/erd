import {ActionIcon, Center, Checkbox, Input, Table} from "@mantine/core";
import {IconDiamondsFilled, IconGripVertical, IconKey} from "@tabler/icons-react";
import React from "react";
import {IErdNodeColumn} from "@/types/erd-node";
import {useErdTableData} from "@/contexts/ErdTableDataContext.ts";
import styles from "./style.module.css"


const ColumnTypeIcon = React.memo(({data}: { data: IErdNodeColumn }) => {

  if (data.primary) return <IconKey stroke={2} color={"#ffcd62"} size={20}/>

  if (data.foreignKey) return <IconDiamondsFilled style={{color: "#f84219"}} stroke={1} size={15}/>

  return <IconDiamondsFilled style={{color: "#00d0ff"}} stroke={1} size={15}/>
})

const RenderItem = React.memo(({data}: { data: IErdNodeColumn }) => {
  const {setColumn} = useErdTableData()

  const setData = (key: string, value: any) => {
    const updatedColumn = {...data} as any
    updatedColumn[key] = value
    setColumn(updatedColumn)
  }

  return (
    <Table.Tr className={`${styles.tableRow}`}>
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
          placeholder={"Column name"}
          onChange={e => setData('name', e.target.value)}
          h={"inherit"}
        />
      </Table.Td>
      <Table.Td>
        <Input
          value={data.type}
          placeholder={"Data type"}
          h={"inherit"}
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
          onChange={e => setData('comment', e.target.value)}
        />
      </Table.Td>

    </Table.Tr>
  )


})

export default RenderItem
