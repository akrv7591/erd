import {useAuthStore} from "@/stores/useAuthStore.ts";
import {AppShell, Group, Text} from "@mantine/core";
import Navbar from "@/screens/Library/Navbar";
import Main from "@/screens/Library/Main/Main.tsx";

export default function Content() {
  const user = useAuthStore(state => state.getAuthorization())

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
      <AppShell.Main>
        <Main/>
      </AppShell.Main>
    </>
  )
}
