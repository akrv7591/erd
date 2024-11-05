import '@xyflow/react/dist/style.css';
import {Main} from "./Main";
import {AppShell} from "@mantine/core";
import {Helmet} from "react-helmet-async";
import {Header} from "@/screens/Playground/Header";
import {Navbar} from "@/screens/Playground/Navbar";
import {Aside} from "@/screens/Playground/Aside";
import {Footer} from "@/screens/Playground/Footer";
import {useDiagramStore} from "@/hooks";
import {LoadingBackdrop} from "@/components/common/LoadingBackdrop";

export default function Playground() {
  const synced = useDiagramStore(state => state.synced)

  if (!synced) return (
    <LoadingBackdrop title={"Loading entity diagram"}/>
  )

  return (
    <AppShell
      header={{height: 50}}
      navbar={{width: 50, breakpoint: "none"}}
      footer={{height: 50}}
      aside={{width: 50, breakpoint: "none"}}
    >
      <Helmet>
        <title>Erdiagramly</title>
      </Helmet>
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar/>
      </AppShell.Navbar>
      <AppShell.Aside>
        <Aside/>
      </AppShell.Aside>
      <AppShell.Main>
        <Main/>
      </AppShell.Main>
      <AppShell.Footer>
        <Footer/>
      </AppShell.Footer>
    </AppShell>

  )
}
