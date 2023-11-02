import {Outlet} from "react-router-dom";
import {AppShell} from "@mantine/core";
import Header from "./Header";

export default function HomeLayout() {
  return (
    <AppShell
      header={{height: 60}}
      padding="md"
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet/>
      </AppShell.Main>
    </AppShell>
  );
}
