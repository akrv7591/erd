import {FC, memo} from "react";
import {DragButton} from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Table/Row/DragButton";
import {Center, Checkbox, Input, Table} from "@mantine/core";
import {TypeIcon} from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Table/Row/TypeIcon";
import {EntityColumn} from "@/types/diagram";
import {useUpdateEntityColumn} from "@/hooks";

const {Td, Tr} = Table

interface Props {
  data: EntityColumn
  patchColumn: ReturnType<typeof useUpdateEntityColumn>
}

export const EditorModeColumns: FC<Props> = memo(({data, patchColumn}) => {
  return (
    <Tr>
      <Td className={"nopan nodrag handle"}>
        <DragButton/>
      </Td>
      <Td>
        <Checkbox
          checked={data.selected}
          onChange={(e) => patchColumn('selected', e.target.checked)}
        />
      </Td>
      <Td>
        <Center>
          <TypeIcon data={data}/>
        </Center>
      </Td>
      <Td>
        <Input
          value={data.name}
          variant={"filled"}
          placeholder={"Column name"}
          size={"sm"}
          onChange={e => patchColumn('name', e.target.value)}
        />
      </Td>
      <Td>
        <Input
          variant={"filled"}
          value={data.type}
          placeholder={"Data type"}
          size={"sm"}
          onChange={e => patchColumn('type', e.target.value)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.primary}
          onChange={(e) => patchColumn('primary', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.notNull}
          onChange={(e) => patchColumn('notNull', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.unique}
          onChange={(e) => patchColumn('unique', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.unsigned}
          onChange={(e) => patchColumn('unsigned', e.target.checked)}
        />
      </Td>
      <Td>
        <Checkbox
          checked={data.autoIncrement}
          onChange={(e) => patchColumn('autoIncrement', e.target.checked)}
        />
      </Td>
      <Td>
        <Input
          value={data.comment}
          placeholder={"Comment"}
          size={"sm"}
          variant={"filled"}
          onChange={e => patchColumn('comment', e.target.value)}
        />
      </Td>
    </Tr>
  )
})
