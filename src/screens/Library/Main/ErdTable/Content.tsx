import {Loader, Table} from "@mantine/core";
import {IconError404} from "@tabler/icons-react";
import Erd from "@/screens/Library/Main/Erd";
import {UseQueryResult} from "@tanstack/react-query";
import {memo} from "react";
import {IErd} from "@/types/data/db-model-interfaces.ts";
import EmptyList from "@/components/common/EmptyList.tsx";

interface Props {
  status: UseQueryResult['status']
  erds: IErd[]
}

const Loading = () => {
  return (
    <Table.Tr h={"calc(100vh - 350px)"}>
      <Table.Td colSpan={7} align={"center"}>
        <Loader size={20}/>
      </Table.Td>
    </Table.Tr>
  )
}
const Error = () => {
  return (
    <Table.Tr h={"calc(100vh - 350px)"}>
      <Table.Td colSpan={7} align={"center"}>
        <IconError404/>
      </Table.Td>
    </Table.Tr>
  )
}

const Empty = () => {
  return (
    <Table.Tr h={"calc(100vh - 350px)"}>
      <Table.Td colSpan={7} align={"center"}>
        <EmptyList/>
      </Table.Td>
    </Table.Tr>
  )
}

const Content = memo((props: Props) => {
  switch (props.status) {
    case "pending":
      return <Loading/>
    case "error":
      return <Error/>
    case "success":
      if (props.erds.length === 0) return <Empty/>

      return props.erds.map(erd => <Erd key={erd.id} erd={erd}/>)
    default:
      return null
  }
})


export default Content
