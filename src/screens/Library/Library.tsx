import {AppShell} from "@mantine/core";
import {Header} from "@/components/common/Header";
import {Navbar} from "@/screens/Library/Navbar";
import {Main} from "@/screens/Library/Main/Main.tsx";
import {memo} from "react";
import {useLibraryStore} from "@/stores/useLibrary.ts";


export const Library = memo(() => {
  const team = useLibraryStore(state => state.team)

  return (
    <AppShell
      header={{height: 60}}
      navbar={{
        width: 250,
        breakpoint: "xs",
        collapsed: {
          mobile: true
        }
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar/>
      </AppShell.Navbar>
      <AppShell.Main>
        {team.id && <Main/>}
      </AppShell.Main>
    </AppShell>
  )
})
