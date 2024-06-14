import {memo} from "react";
import {Card} from "@mantine/core";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";
import {CustomTheme} from "@/components/common/CustomTheme";
import {NameOverlay} from "./NameOverlay";
import {Header} from "./Header";
import {Table} from "./Table";
import {RelationsOverlay} from "./RelationsOverlay";
import "./style.css"

export const Content = memo(() => {
  const {data, id} = useEntityNodeData()

  return (
    <CustomTheme color={data.color} id={id}>
      <NameOverlay/>
      <Card className={"entity-container"} withBorder>
        <Header/>
        <Table/>
      </Card>
      <RelationsOverlay/>
    </CustomTheme>
  )
})
