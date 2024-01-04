import {Outlet} from "react-router-dom";
import {AppShell, Group, Text} from "@mantine/core";
import Header from "./Header";
import Navbar from "./Navbar";
import Aside from "./Aside";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {useLibraryStore} from "@/stores/useLibrary.ts";

export default function ErdListLayout() {
  const user = useAuthStore(state => state.getAuthorization())
  const team = useLibraryStore(state => state.team)
  const teams = useLibraryStore(state => state.teams)

  return (
    <AppShell
      header={{height: 60}}
      navbar={{width: 250, breakpoint: "sm"}}
      {...team && {aside:{width: 250, breakpoint: "sm"}}}
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
              {team && (
                  <AppShell.Aside>
                    <Aside/>
                  </AppShell.Aside>
              )}
              {teams.length > 0 && (
                <AppShell.Main>
                  <Outlet/>
                </AppShell.Main>
              )}

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
