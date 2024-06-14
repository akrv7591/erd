import {Group} from "@mantine/core";
import {Import} from "./Import";
import {Export} from "./Export";

export const Footer = () => {
  return (
    <Group align={"center"} gap={"5px"} h={"100%"} px={"55px"}>
      <Import/>
      <Export/>
    </Group>
  )
}
