import {RenderItemParams} from "react-movable";
import {ActionIcon, Center, Checkbox, Input, Table} from "@mantine/core";
import {IconDiamondsFilled, IconGripVertical, IconKey} from "@tabler/icons-react";
import React from "react";
import {useNodeId, useReactFlow, useStoreApi} from "reactflow";
import styles from "./style.module.css"
import {IErdNodeColumn} from "../../../../../types/erd-node";
import {useErdTableData} from "../../../../../contexts/ErdTableDataContext.ts";


const ColumnTypeIcon = React.memo(({data}: { data: IErdNodeColumn }) => {

  if (data.primary) return <IconKey stroke={2} color={"#ffcd62"} size={20}/>

  if (data.foreignKey) return <IconDiamondsFilled style={{color: "#f84219"}} stroke={1} size={15}/>

  return <IconDiamondsFilled style={{color: "#00d0ff"}} stroke={1} size={15}/>
})

const RenderItem = React.memo(({isDragged, props, value: data}: RenderItemParams<IErdNodeColumn>) => {
  const flowStoreApi = useStoreApi()
  const reactFlow = useReactFlow()
  const node = reactFlow.getNode(useNodeId() as string)
  const {setColumn} = useErdTableData()

  const setData = (key: string, value: any) => {
    const updatedColumn = {...data} as any
    updatedColumn[key] = value
    setColumn(updatedColumn)
  }

  const row = (
    <Table.Tr {...props} key={data.id} className={isDragged ? styles.tableRowDrag : styles.tableRow}>
      <Table.Td>
        <ActionIcon variant={"subtle"}>
          <IconGripVertical
            stroke={1}
            data-movable-handle
            onMouseOver={() => flowStoreApi.setState({paneDragging: false})}
            onMouseEnter={
              () => {
                flowStoreApi.setState({nodesDraggable: false, paneDragging: false})
                if (reactFlow.getZoom() !== 1) {
                  reactFlow.fitView({
                    duration: 200,
                    minZoom: 1,
                    maxZoom: 1,
                    nodes: [node!]
                  })
                }
              }}
            onMouseLeave={() => flowStoreApi.setState({nodesDraggable: true, paneDragging: true})}
          />
        </ActionIcon>
      </Table.Td>
      <Table.Td>
        <Checkbox defaultChecked={data.selected} onChange={(e) => setData('selected', e.target.checked)}/>
      </Table.Td>
      <Table.Td>
        <Center>
          <ColumnTypeIcon data={data}/>
        </Center>
      </Table.Td>
      <Table.Td>
        <Input
          defaultValue={data.name}
          placeholder={"Column name"}
          autoFocus={!isDragged}
          onChange={e => setData('name', e.target.value)}
        />
      </Table.Td>
      <Table.Td>
        <Input
          defaultValue={data.type}
          placeholder={"Data type"}
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
        <Checkbox checked={data.autoIncrement}
                  onChange={(e) => setData('autoIncrement', e.target.checked)}/>
      </Table.Td>
      <Table.Td>
        <Input
          defaultValue={data.comment}
          placeholder={"Comment"}
          onChange={e => setData('comment', e.target.value)}
        />
      </Table.Td>

    </Table.Tr>
  )


  return isDragged
    ?
    (
      <Table style={{...props.style}}>
        <Table.Tbody>
          {row}
        </Table.Tbody>
      </Table>
    )
    : row

})

export default RenderItem
