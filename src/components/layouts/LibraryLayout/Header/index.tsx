import {Group} from "@mantine/core";
import Account from "../../../common/Account";
import Logo from "../../../common/Logo.tsx";
import {Link} from "react-router-dom";

export default function Header() {
  return (
    <Group align={"center"} justify={"space-between"} px={"20px"} h={"100%"}>
      <Link to={"/"}>
        <Logo/>
      </Link>
      <Account/>
    </Group>
  )
}
