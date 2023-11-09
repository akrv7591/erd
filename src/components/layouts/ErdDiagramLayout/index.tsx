import {AppShell, Center, Loader} from "@mantine/core";
import {Navigate, Outlet, useParams,} from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Aside from "./Aside";
import React from "react";
import Footer from "./Footer";
import {useErdDiagramStore} from "../../../hooks/erd/useErdDiagramStore";
import {useShallow} from "zustand/react/shallow";
import {useQuery} from "react-query";
import erdApi from "../../../api/erdApi.tsx";
import {IApiList} from "../../../types/data/util";
import {IColumn} from "../../../types/data/column";
import {IRelation} from "../../../types/data/relations";
import {ITable} from "../../../types/data/table";

// interface ITablesAndRelationsResponse {
//   column: IApiList<IColumn>;
//   relation: IApiList<IRelation>
// }
//
// const tablesAndRelationsQueryFn = (erdId: string) => Promise.all([
//   erdApi.get(`/v1/erd/${erdId}/column`).then(res => res.data),
//   erdApi.get(`/v1/erd/${erdId}/relation`).then(res => res.data)
// ]).then(([column, relation]) => ({column, relation}))

interface ITableResponse extends IApiList<ITable> {}
const tableQueryFn = (erdId: string) => erdApi(`/v1/erd/${erdId}/table`).then(res => res.data)



export default function ErdDiagramLayout() {
  const setErdDiagramState = useErdDiagramStore(state => state.setState)
  const {erdId} = useParams<{ erdId: string }>()
  const {status} = useQuery<ITableResponse>({
    queryKey: ['tablesRelationsList'],
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: () => tableQueryFn(erdId as string),
    onSuccess: ({rows}) => {
      console.log({rows})
      setErdDiagramState({
        nodes: rows,
        erdId
      })
    }
  })

  if (!erdId) return <Navigate to={"/"}/>

  const Content = () => {
    switch (status) {
      case "loading":
        return (
          <Center w={"100%"} h={"100%"}>
            <Loader size={"xs"}/>
          </Center>
        )
      case "error":
        return <Navigate to={"/"}/>
      case "success":
        return <Outlet />
    }
  }

  return (
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
        <Content />
      </AppShell.Main>
      <AppShell.Footer>
        <Footer/>
      </AppShell.Footer>
    </AppShell>
  )
}
