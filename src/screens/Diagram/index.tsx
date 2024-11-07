import '@xyflow/react/dist/style.css';
import {Main} from "./Main";
import {AppShell} from "@mantine/core";
import {Helmet} from "react-helmet-async";
import {Header} from "@/screens/Diagram/Header";
import {Navbar} from "@/screens/Diagram/Navbar";
import {Aside} from "@/screens/Diagram/Aside";
import {Footer} from "@/screens/Diagram/Footer";

export default function Diagram() {
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
