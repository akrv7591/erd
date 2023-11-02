import {Burger, Button, Group, Title} from "@mantine/core";
import {Link, NavLink} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import classes from "./styles.module.css"
import {useAuthStore} from "../../../../stores/useAuthStore";
import Account from "../../../common/Account";

export default function Header() {
  const [opened, {toggle}] = useDisclosure();
  const authorized = useAuthStore(state => state.authorized)

  return (
    <Group h="100%" px="xl" justify={"space-between"} align={"center"}>
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
        <Title order={4}>
          ERD
        </Title>
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
        {authorized
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
