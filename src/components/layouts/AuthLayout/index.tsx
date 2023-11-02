import {Center, Container} from "@mantine/core";
import classes from "./style.module.css"
import {Navigate, Outlet} from "react-router-dom";
import {useAuthStore} from "../../../stores/useAuthStore";

export default function AuthLayout() {
  const authorized = useAuthStore(state => state.authorized)

  if (authorized) return <Navigate to={"/"} />

  return (
    <Container fluid className={classes.root}>
      <Center h={"100%"}>
        <Outlet />
      </Center>
    </Container>
  )
}
