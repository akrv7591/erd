import {useAuthStore} from "@/stores/useAuthStore.ts";
import {AppShell, Group, Text} from "@mantine/core";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import Navbar from "@/screens/Library/Navbar";
import Aside from "@/screens/Library/Aside";
import Main from "@/screens/Library/Main/Main.tsx";

export default function Content() {
  const user = useAuthStore(state => state.getAuthorization())
  const team = useLibraryStore(state => state.team)
  const teams = useLibraryStore(state => state.teams)

  if (!user?.emailVerified) {
    return (
      <AppShell.Main>
        <Group justify={"center"} mt={50}>
          <Text size={'xl'}>Please verify your email to be able to use all features</Text>
        </Group>
      </AppShell.Main>
    )
  }

  return (
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
          <Main/>
        </AppShell.Main>
      )}
    </>
  )
}
