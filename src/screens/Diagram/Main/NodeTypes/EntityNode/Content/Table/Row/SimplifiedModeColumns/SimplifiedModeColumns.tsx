import {FC, memo} from "react";
import {Center, Input, Table} from "@mantine/core";
import {TypeIcon} from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Table/Row/TypeIcon";
import {EntityColumn} from "@/types/diagram";
import {useUpdateEntityColumn} from "@/hooks";

interface Props {
  data: EntityColumn
  patchColumn: ReturnType<typeof useUpdateEntityColumn>
}

const {Tr, Td} = Table

export const SimplifiedModeColumns: FC<Props> = memo(({data, patchColumn}) => {

  return (
    <Tr>
      <Td>
        <Center>
          <TypeIcon data={data}/>
        </Center>
      </Td>
      <Td>
        <Input
          value={data.name}
          size={"sm"}
          variant={"filled"}
          placeholder={"Column name"}
          onChange={e => patchColumn('name', e.target.value)}
        />
      </Td>
      <Td>
        <Input
          value={data.type}
          placeholder={"Data type"}
          variant={"filled"}
          size={"sm"}
          miw={"200px"}
          onChange={e => patchColumn('type', e.target.value)}
        />
      </Td>
    </Tr>
  )
})
