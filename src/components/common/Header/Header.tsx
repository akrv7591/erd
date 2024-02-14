import {Burger, Button, Group} from "@mantine/core";
import {Link} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import "./styles.css"
import {useAuthStore} from "@/stores/useAuthStore.ts";
import Logo from "@/components/common/Logo.tsx";
import {IconBooks} from "@tabler/icons-react";
import Account from "@/components/common/Account";

export default function Header() {
  const [opened, {toggle}] = useDisclosure();
  const authorizedUser = useAuthStore(state => state.getAuthorization())

  return (
    <Group h="100%" px="20" justify={"space-between"} align={"center"}>
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
        <Link to={"/"}>
          <Logo/>
        </Link>
      </Group>
      <Group gap={5}>
        <Link to={"/library"} state={{destination: "/library"}}>
          <Button
            leftSection={<IconBooks/>}
            variant={"filled"}>
            Library
          </Button>
        </Link>
        {authorizedUser && <Account/>}
      </Group>
    </Group>
  )
}
