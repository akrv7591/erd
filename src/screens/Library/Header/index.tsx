import {Group} from "@mantine/core";
import Account from "@/components/common/Account";
import Logo from "@/components/common/Logo";

export default function Header() {
  return (
    <Group align={"center"} justify={"space-between"} px={"15px"} h={"100%"}>
      <Logo/>
      <Account/>
    </Group>
  )
}
