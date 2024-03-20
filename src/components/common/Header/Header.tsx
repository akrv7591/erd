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
        <Logo/>
      </Group>
      <Group gap={5}>
        <Link to={"/library"} state={{destination: "/library"}}>
          <Button
            size={"sm"}
            leftSection={<IconBooks size={"20"}/>}
            variant={"default"}>
            Library
          </Button>
        </Link>
        {authorizedUser && <Account/>}
      </Group>
    </Group>
  )
}
