import {Outlet} from "react-router-dom";
import {AppShell} from "@mantine/core";
import Header from "./Header";

export default function HomeLayout() {
  return (
    <AppShell
      header={{height: 60}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main p={0} pt={"60"}>
        <Outlet/>
      </AppShell.Main>
    </AppShell>
  );
}
