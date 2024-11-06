import {AppShell} from "@mantine/core";
import {Header} from "@/components/common/Header";
import {Navbar} from "@/screens/Library/Navbar";
import {Main} from "@/screens/Library/Main/Main";
import { SelectedTeamContext } from "@/contexts/SelectedTeamContext";
import { useState } from "react";
import { UserTeam } from "@/types/log-to/user-team";

export default function Library() {
  const [selectedTeam, setSelectedTeam] = useState<UserTeam | null>(null)

  return (
    <SelectedTeamContext.Provider value={{selectedTeam, setSelectedTeam}}>
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
          <Main/>
        </AppShell.Main>
      </AppShell>
    </SelectedTeamContext.Provider>
  )
}
