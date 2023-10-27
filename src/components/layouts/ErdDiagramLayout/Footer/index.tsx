import {Group} from "@mantine/core";
import Import from "./Import";
import Export from "./Export";

export default function Footer() {
  return (
    <Group align={"center"} gap={"10px"} h={"100%"} px={"50px"}>
      <Import/>
      <Export/>
    </Group>
  )
}
