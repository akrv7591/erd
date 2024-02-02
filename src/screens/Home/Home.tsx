import {AppShell} from "@mantine/core";
import Header from "@/components/common/Header/Header.tsx";
import Main from "@/screens/Home/Main/Main.tsx";

export default function Home() {
  return (
    <AppShell
      header={{height: 60}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main p={0} pt={"60"}>
        <Main/>
      </AppShell.Main>
    </AppShell>
  );
}
