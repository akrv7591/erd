import {ActionIcon, Collapse, Divider, Group, Stack, Tooltip,} from "@mantine/core";
import React from "react";
import {List} from "react-movable";
import {IconTrash} from "@tabler/icons-react";
import RenderList from "./RenderList";
import RenderItem from "./RenderItem";
import {useErdTableData} from "../../../../../providers/ErdTableDataProvider";

const Content = React.memo(() => {
  const {data, deleteSelectedColumns, reorderColumns} = useErdTableData()
  const selectedColumns = React.useMemo(() => data.columns.filter(column => column.selected), [data.columns])

  return (
    <Stack>
      <List
        values={data.columns}
        lockVertically
        onChange={reorderColumns}
        renderList={params => <RenderList rowLength={data.columns.length} {...params} />}
        renderItem={params => <RenderItem key={params.value.order} {...params} />}
      />
      <Divider w={"100%"}/>

      <Group mt={"sm"}>
        <Collapse in={selectedColumns.length > 0}>
          <Tooltip label={`Delete ${selectedColumns.length} columns`}>
            <ActionIcon color={"red"} onClick={deleteSelectedColumns}>
              <IconTrash stroke={1}/>
            </ActionIcon>
          </Tooltip>
        </Collapse>
      </Group>
    </Stack>
  )
})

export default Content
