import {useQuery} from "@tanstack/react-query";
import erdApi from "@/api/erdApi.tsx";
import {Group, Loader, Text, Tooltip} from "@mantine/core";
import {IconExclamationCircle} from "@tabler/icons-react";
import {memo} from "react";

interface Props {
  erdId: string
}

const TableCount = memo(({erdId}: Props) => {
  const {data, status} = useQuery({
    queryKey: ['erdTableCount', erdId],
    queryFn: () => erdApi.get<{ count: number }>(`/v1/erd/${erdId}/entity/count`).then(res => res.data)
  })

  switch (status) {
    case "error":
      return (
        <Tooltip label={"Some error"}>
          <Group gap={2}>
            <IconExclamationCircle color={"var(--mantine-color-red-light)"} stroke={1} size={20}/>
          </Group>
        </Tooltip>
      )
    case "pending":
      return (
        <Tooltip label={"Loading"}>
          <Group gap={2}>
            <Loader size={"xs"}/>
          </Group>
        </Tooltip>
      )
    case "success":
      return (
        <Tooltip label={`${data.count} entities`}>
          <Group gap={2}>
            <Text>{data.count}</Text>
          </Group>
        </Tooltip>
      )
    default:
      return null
  }
})


export default TableCount
