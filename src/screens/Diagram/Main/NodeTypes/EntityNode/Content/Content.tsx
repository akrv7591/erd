import { memo } from "react";
import { Card } from "@mantine/core";
import { Header } from "./Header";
import { Table } from "./Table";
import { RelationsOverlay } from "./RelationsOverlay";
import { NameOverlay } from "./NameOverlay";

import "./style.css"

export const Content = memo(() => {
  return (
    <>
      <Card className={"entity-container"} withBorder>
        <Header />
        <Table />
      </Card>
      <RelationsOverlay />
      <NameOverlay />
    </>
  )
})
