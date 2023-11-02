import {Outlet} from "react-router-dom";
import {AppShell} from "@mantine/core";
import Header from "./Header";
import React from "react";
import Navbar from "./Navbar";

export default function ErdListLayout() {
  console.log("ERD_LIST MOUNTED")
  return (
    <AppShell
      header={{height: 70}}
      navbar={{width: 300, breakpoint: "sm"}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet/>
      </AppShell.Main>
    </AppShell>
  )
}
