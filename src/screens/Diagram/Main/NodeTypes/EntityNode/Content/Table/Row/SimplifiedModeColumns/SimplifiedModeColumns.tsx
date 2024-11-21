import {FC, memo} from "react";
import {Center, Input, Table} from "@mantine/core";
import {TypeIcon} from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Table/Row/TypeIcon";
import {EntityColumn} from "@/types/diagram";

interface Props {
  data: EntityColumn
  handleChange: (
    key: keyof EntityColumn,
  ) => React.ChangeEventHandler<HTMLInputElement>;
}

const {Tr, Td} = Table

export const SimplifiedModeColumns: FC<Props> = memo(({data, handleChange}) => {

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
          onChange={handleChange('name')}
        />
      </Td>
      <Td>
        <Input
          value={data.type}
          placeholder={"Data type"}
          variant={"filled"}
          size={"sm"}
          miw={"200px"}
          onChange={handleChange('type')}
        />
      </Td>
    </Tr>
  )
})
