import {Group, Text} from "@mantine/core";
import Account from "../../../common/Account";

export default function Header() {
  return (
    <Group align={"center"} justify={"space-between"} px={"20px"} h={"100%"}>
      <Text>ERD</Text>
      <Account/>
    </Group>
  )
}
