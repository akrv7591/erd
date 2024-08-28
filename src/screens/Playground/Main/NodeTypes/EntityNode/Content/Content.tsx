import {memo} from "react";
import {Card} from "@mantine/core";
import {CustomTheme} from "@/components/common/CustomTheme";
import {NameOverlay} from "./NameOverlay";
import {Header} from "./Header";
import {Table} from "./Table";
import {RelationsOverlay} from "./RelationsOverlay";
import "./style.css"
import {EntityData} from "@/providers/shared-diagram-store-provider/type.ts";

type Props = {
  data: EntityData
  id: string
}

export const Content = memo((props: Props) => {
  return (
    <CustomTheme color={props.data.color} id={props.id}>
      <NameOverlay/>
      <Card className={"entity-container"} withBorder>
        <Header/>
        <Table/>
      </Card>
      <RelationsOverlay/>
    </CustomTheme>
  )
})


