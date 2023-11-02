import {Group} from "@mantine/core";
import Logo from "./Logo";
import Title from "./Title";

export default function Header() {
  return (
    <Group align={"center"} px={"10px"} h={"100%"}>
      <Logo/>
      <Title />
    </Group>
  )
}
