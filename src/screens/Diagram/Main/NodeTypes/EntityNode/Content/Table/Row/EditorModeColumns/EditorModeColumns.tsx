import { FC, memo } from "react";
import { DragButton } from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Table/Row/DragButton";
import { Center, Checkbox, Input, Table } from "@mantine/core";
import { TypeIcon } from "@/screens/Diagram/Main/NodeTypes/EntityNode/Content/Table/Row/TypeIcon";
import { EntityColumn } from "@/types/diagram";

const { Td, Tr } = Table;

interface Props {
  data: EntityColumn;
  handleChange: (
    key: keyof EntityColumn,
  ) => React.ChangeEventHandler<HTMLInputElement>;
}

export const EditorModeColumns: FC<Props> = memo(({ data, handleChange }) => {
  return (
    <Tr>
      <Td className={"nopan nodrag handle"}>
        <DragButton />
      </Td>
      <Td>
        <Checkbox checked={data.selected} onChange={handleChange("selected")} />
      </Td>
      <Td>
        <Center>
          <TypeIcon data={data} />
        </Center>
      </Td>
      <Td>
        <Input
          value={data.name}
          variant={"filled"}
          placeholder={"Column name"}
          size={"sm"}
          miw={150}
          onChange={handleChange("name")}
        />
      </Td>
      <Td>
        <Input
          variant={"filled"}
          value={data.type}
          placeholder={"Data type"}
          size={"sm"}
          miw={150}
          onChange={handleChange("type")}
        />
      </Td>
      <Td>
        <Checkbox checked={data.primary} onChange={handleChange("primary")} />
      </Td>
      <Td>
        <Checkbox checked={data.notNull} onChange={handleChange("notNull")} />
      </Td>
      <Td>
        <Checkbox checked={data.unique} onChange={handleChange("unique")} />
      </Td>
      <Td>
        <Checkbox checked={data.unsigned} onChange={handleChange("unsigned")} />
      </Td>
      <Td>
        <Checkbox
          checked={data.autoIncrement}
          onChange={handleChange("autoIncrement")}
        />
      </Td>
      <Td>
        <Input
          value={data.comment}
          placeholder={"Comment"}
          size={"sm"}
          variant={"filled"}
          onChange={handleChange("comment")}
        />
      </Td>
    </Tr>
  );
});
