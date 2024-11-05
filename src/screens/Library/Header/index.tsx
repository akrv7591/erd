import {Group} from "@mantine/core";
import {Account} from "@/components/common/Account";
import {AppLogo} from "@/components/common/AppLogo";

export default function Header() {
  return (
    <Group align={"center"} justify={"space-between"} px={"15px"} h={"100%"}>
      <AppLogo/>
      <Account/>
    </Group>
  )
}
