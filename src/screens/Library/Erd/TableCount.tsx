import {useQuery} from "react-query";
import erdApi from "../../../api/erdApi.tsx";
import {Group, Loader, Text, Tooltip} from "@mantine/core";
import {IconExclamationCircle, IconTable} from "@tabler/icons-react";

interface Props {
  erdId: string
}

export default function TableCount({erdId}: Props) {
  const {data, status} = useQuery({
    queryKey: ['erdTableCount', erdId],
    queryFn: () => erdApi.get<{ count: number }>(`/v1/erd/${erdId}/table/count`).then(res => res.data)
  })

  switch (status) {
    case "error":
      return (
        <Tooltip label={"Some error"} >
          <Group gap={2}>
            <IconExclamationCircle color={"var(--mantine-color-red-light)"} stroke={1} size={20}/>
          </Group>
        </Tooltip>
      )
    case "loading":
      return (
        <Tooltip label={"Loading"} >
          <Group gap={2}>
            <Loader size={"xs"}/>
          </Group>
        </Tooltip>
      )
    case "success":
      return (
        <Tooltip label={`${data.count} tables`}>
          <Group gap={2}>
            <Text>{data.count}</Text>
            <IconTable stroke={1} size={20}/>
          </Group>
        </Tooltip>
      )
    default:
      return null
  }
}
