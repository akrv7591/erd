import { Group, Text} from "@mantine/core";
import ThemeToggle from "components/common/ThemeToggle";

export default function Header() {
  return (
    <Group align={"center"} justify={"space-between"} p={"10px"} h={"100%"}>
      <Text>ERD</Text>
      <ThemeToggle />
    </Group>
  )
}
