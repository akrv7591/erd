import {AppShell} from "@mantine/core";
import Header from "@/components/common/Header/Header.tsx";
import Main from "@/screens/Home/Main/Main.tsx";
import {ReactFlowProvider} from "@xyflow/react";

export default function Home() {
  return (
    <AppShell
      header={{height: 60}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main p={0} pt={"60"}>
        <ReactFlowProvider>
          <Main/>
        </ReactFlowProvider>
      </AppShell.Main>
    </AppShell>

  );
}
