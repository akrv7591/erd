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
  const onPress = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const target = window.document.getElementById(
      e.currentTarget.href.split("#")[1]
    );
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }
  };
  return (
    <Group h="100%" px="20" justify={"space-between"} align={"center"}>
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
        <Link to={"/"}>
          <Logo/>
        </Link>
      </Group>
      <Group>
        <a onClick={onPress} className={"link"} href={"#first_look"} data-to-scrollspy-id="first_look">
          First look
        </a>
        <a onClick={onPress} className={"link"} href={"#features"} data-to-scrollspy-id="features">
          Features
        </a>
      </Group>
      <Group gap={5}>
        <Link to={"library"}>
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
