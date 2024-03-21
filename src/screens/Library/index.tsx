import {AppShell} from "@mantine/core";
import Header from "./Header";
import Content from "@/screens/Library/Content.tsx";


export default function Library() {
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
        <Header/>
      </AppShell.Header>
      <Content/>
    </AppShell>
  )
}
