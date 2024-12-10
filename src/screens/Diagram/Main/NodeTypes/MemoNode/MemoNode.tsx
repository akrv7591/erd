import { memo } from "react";
import { Editor } from "./Editor";
import { Card } from "@mantine/core";
import {Header} from "./Header";
import "./style.css"

export const MemoNode = memo(() => {
  return (
    <Card p={0} radius={"sm"}>
      <Header />
      <Editor />
    </Card>
  )
})
