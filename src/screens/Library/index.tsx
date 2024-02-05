import {AppShell} from "@mantine/core";
import Header from "./Header";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import Content from "@/screens/Library/Content.tsx";


export default function Library() {
  const team = useLibraryStore(state => state.team)

  return (
    <AppShell
      header={{height: 60}}
      navbar={{width: 250, breakpoint: "sm"}}
      {...team && {aside: {width: 250, breakpoint: "sm"}}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <Content/>
    </AppShell>
  )
}
