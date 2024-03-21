import {ActionIcon, Collapse, Group, Stack,} from "@mantine/core";
import React from "react";
import {IconTrash} from "@tabler/icons-react";
import RenderItem from "./RenderItem.tsx";
import {useErdTableData} from "@/screens/Home/Main/Reactflow/ErdTableDataContext.ts";
import {ReactSortable} from "react-sortablejs";
import styles from "./style.module.css"
import "./style.module.css"
import RenderList from "./RenderList.tsx";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";

const Content = React.memo(() => {
  const {data, deleteSelectedColumns, setSortedColumns} = useErdTableData()
  const selectedColumns = React.useMemo(() => data.columns.filter(column => column.selected), [data.columns])

  return (
    <Stack gap={0} style={{position: "relative"}}>
      <ReactSortable
        tag={RenderList}
        list={data.columns}
        dragClass={styles.ghostRowClass}
        ghostClass={styles.tableRowDrag}
        chosenClass={styles.tableRowDrag}
        setList={setSortedColumns}
        multiDrag
        handle={".handle"}
      >
        {data.columns.map((item) => (
          <RenderItem key={item.id + item.order} data={item}/>
        ))}
      </ReactSortable>

      <Group>
        <Collapse in={selectedColumns.length > 0}>
          <ButtonWithConfirm
            isDanger
            tooltip={`Delete ${selectedColumns.length} columns`}
            target={(
              <ActionIcon color={"red"} variant={"filled"}>
                <IconTrash stroke={1}/>
              </ActionIcon>
            )}
            message={`Do you want to delete ${selectedColumns.length} ${selectedColumns.length > 1 ? "columns" : "column"}`}
            onConfirm={deleteSelectedColumns}
          />
        </Collapse>
      </Group>
    </Stack>
  )
})

export default Content
