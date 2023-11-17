import {Burger, Button, Group} from "@mantine/core";
import {Link, NavLink} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import classes from "./styles.module.css"
import {useAuthStore} from "../../../../stores/useAuthStore";
import Account from "../../../common/Account";
import Logo from "../../../common/Logo.tsx";

export default function Header() {
  const [opened, {toggle}] = useDisclosure();
  const authorizedUser = useAuthStore(state => state.getAuthorization())

  return (
    <Group h="100%" px="20" justify={"space-between"} align={"center"}>
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
        <Link to={"/"}>
          <Logo />
        </Link>
      </Group>
      <Group>
        <NavLink to={""} className={({isActive}) => isActive ? classes.activeLink : classes.link}>
          Home
        </NavLink>
        <NavLink to={"features"} className={({isActive}) => isActive ? classes.activeLink : classes.link}>
          Features
        </NavLink>
      </Group>
      <Group gap={5}>
        {authorizedUser
          ? <Account/>
          : (
            <Link to={"auth"}>
              <Button>
                Sign in
              </Button>
            </Link>
          )
        }
      </Group>
    </Group>
  )
}
