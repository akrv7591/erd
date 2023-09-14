import {ActionIcon, Collapse, Divider, Group, Stack, Tooltip,} from "@mantine/core";
import React from "react";
import {List} from "react-movable";
import {useTableData} from "../../../../../providers/TableDataProvider";
import {atom, useAtom, useAtomValue, useSetAtom} from "jotai";
import {IconTrash} from "@tabler/icons-react";
import RenderList from "./RenderList";
import RenderItem from "./RenderItem";
import {edgesAtoms} from "../../../../../atoms/edgesAtoms";
import {useNodeId} from "reactflow";

const Content = React.memo(() => {
  const {dataAtom, reorderColumn} = useTableData()
  const setEdges = useSetAtom(edgesAtoms)
  const data = useAtomValue(dataAtom)
  const [columns, setColumns] = useAtom(data.columns)
  const selectedAtoms = React.useMemo(() => atom((get) => columns.filter(columnAtom => get(columnAtom).selected)), [columns])
  const selectedColumns = useAtomValue(selectedAtoms)
  const selectedColumnsDataAtom = React.useMemo(() => atom((get) => selectedColumns.map(column => get(column))), [selectedColumns])
  const selectedColumnData = useAtomValue(selectedColumnsDataAtom)
  const onChange = useSetAtom(reorderColumn)
  const nodeId = useNodeId()

  const onSelectedDelete = () => {
    setColumns(cur => cur.filter(column => !selectedColumns.includes(column)))
    const ids = selectedColumnData.map(columnData => nodeId + columnData.id)
    console.log(ids)
    setEdges(cur => cur.filter(edge => !ids.includes(edge.id)))
  }


  return (
    <Stack>
      <List
        values={columns}
        onChange={onChange}
        renderList={params => <RenderList rowLength={columns.length} {...params} />}
        renderItem={params => <RenderItem key={params.index} {...params} />}
      />
      <Divider w={"100%"}/>

      <Group mt={"sm"}>
        <Collapse in={selectedColumns.length > 0}>
          <Tooltip label={`Delete ${selectedColumns.length} columns`}>
            <ActionIcon color={"red"} onClick={onSelectedDelete}>
              <IconTrash stroke={1}/>
            </ActionIcon>
          </Tooltip>
        </Collapse>
      </Group>
    </Stack>
  )
})

export default Content
