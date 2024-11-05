import {memo} from "react";
import {Card} from "@mantine/core";
import {CustomTheme} from "@/components/common/CustomTheme";
import {Header} from "./Header";
import {Table} from "./Table";
import {RelationsOverlay} from "./RelationsOverlay";
import {NameOverlay} from "./NameOverlay";
import {useEntityNode} from "@/hooks";
import "./style.css"


export const Content = memo(() => {
  const {id, data} = useEntityNode()

  return (
    <CustomTheme color={data.color} id={id}>
      <Card className={"entity-container"} withBorder>
        <Header/>
        <Table/>
      </Card>
      <RelationsOverlay/>
      <NameOverlay />
    </CustomTheme>
  )
})
