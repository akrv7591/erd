import {Outlet} from "react-router-dom";
import {AppShell, Group, Text} from "@mantine/core";
import Header from "./Header";
import React from "react";
import Navbar from "./Navbar";
import Aside from "./Aside";
import {useAuthStore} from "../../../stores/useAuthStore.ts";

export default function ErdListLayout() {
  const user = useAuthStore(state => state.getAuthorization())

  return (
    <AppShell
      header={{height: 60}}
      navbar={{width: 250, breakpoint: "sm"}}
      aside={{width: 250, breakpoint: "sm"}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      {
        user?.emailVerified
          ? (
            <>
              <AppShell.Navbar>
                <Navbar/>
              </AppShell.Navbar>
              <AppShell.Aside>
                <Aside/>
              </AppShell.Aside>
              <AppShell.Main>
                <Outlet/>
              </AppShell.Main>
            </>
          )
          : (
            <AppShell.Main>
              <Group justify={"center"} mt={50}>
                <Text size={'xl'}>Please verify your email to be able to use all features</Text>
              </Group>
            </AppShell.Main>
          )

      }
    </AppShell>
  )
}
