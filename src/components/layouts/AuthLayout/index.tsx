import {Center, Container} from "@mantine/core";
import classes from "./style.module.css"
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuthStore} from "../../../stores/useAuthStore";

export default function AuthLayout() {
  const user = useAuthStore(state => state.getAuthorization())
  const location = useLocation()

  if (user) return <Navigate to={location.state?.destination? location.state.destination: "/"} />

  return (
    <Container fluid className={classes.root}>
      <Center h={"100%"}>
        <Outlet />
      </Center>
    </Container>
  )
}
