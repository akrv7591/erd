import {AppShell} from "@mantine/core";
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Aside from "./Aside";
import React from "react";
import Footer from "./Footer";
import ErdProvider from "../../../providers/ErdProvider";


export default function ErdDiagramLayout() {
  return (
    <ErdProvider>
      <AppShell
        header={{height: 50}}
        navbar={{width: 50, breakpoint: "none"}}
        aside={{width: 50, breakpoint: "none"}}
        footer={{height: 50}}
      >
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
          <Outlet/>
        </AppShell.Main>
        <AppShell.Footer>
          <Footer/>
        </AppShell.Footer>
      </AppShell>
    </ErdProvider>
  )
}
