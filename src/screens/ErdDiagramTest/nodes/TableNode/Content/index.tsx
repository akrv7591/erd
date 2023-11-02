import {ActionIcon, Collapse, Divider, Group, Stack, Tooltip,} from "@mantine/core";
import React from "react";
import {arrayMove, List} from "react-movable";
import {IconTrash} from "@tabler/icons-react";
import RenderList from "./RenderList";
import RenderItem from "./RenderItem";
import {useErdTableData} from "../../../../../providers/ErdTableDataProvider";

const Content = React.memo(() => {
  const {data, setData} = useErdTableData()
  const selectedColumns = React.useMemo(() => data.columns.filter(column => column.selected), [data.columns])
  const onSelectedDelete = () => setData(curData => ({...curData, columns: curData.columns.filter(column => !selectedColumns.includes(column))}))

  return (
    <Stack>
      <List
        values={data.columns}
        lockVertically
        onChange={(meta) => setData(curData => ({...curData, columns: arrayMove(data.columns, meta.oldIndex, meta.newIndex)}))}
        renderList={params => <RenderList rowLength={data.columns.length} {...params} />}
        renderItem={params => <RenderItem key={params.index} {...params} />}
      />
      <Divider w={"100%"}/>

      <Group mt={"sm"}>
        <Collapse in={selectedColumns.length > 0}>
          <Tooltip label={`Delete ${selectedColumns} columns`}>
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
