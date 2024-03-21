import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {Group, Loader, Pagination, Stack, Text} from "@mantine/core";
import {IconError404} from "@tabler/icons-react";
import Team from "./Team.tsx";
import SearchInput from "@/components/common/SearchInput.tsx";
import {useListQuery} from "@/hooks/useListQuery.ts";
import {teamListApi} from "@/api/team.ts";
import {PaginationUtil} from "@/utility/PaginationUtil.ts";


export default function TeamList() {
  const {params, setParams} = useListQuery({limit: 10})
  const {data = {rows: [], count: 0}, status} = useQuery({
    queryKey: ['teamList', params],
    queryFn: () => teamListApi(params),
    placeholderData: keepPreviousData,
  })


  const Content = () => {
    switch (status) {
      case "pending":
        return <Loader size={"xs"} mt={"lg"} c={"var(--mantine-color-blue-light)"}/>
      case "error":
        return <IconError404/>
      case "success":
        if (data.rows.length === 0) return (
          <Text size={"xs"} mt={"lg"}>No Teams</Text>
        )
        return data.rows.map(team => <Team key={team.id} team={team}/>)
    }
  }

  return (
    <Stack>
      <SearchInput
        size={"xs"}
        w={"100%"}
        px={"10px"}
        onChange={(q) => setParams({q, offset: 0})}
        placeholder={"Search team"}
      />
      <Stack gap={0} px={5} align={"center"} h={"calc(100vh - 230px)"} style={{overflowY: "scroll"}}>
        <Content/>
      </Stack>
      <Group justify={"center"}>
        <Pagination
          total={PaginationUtil.getPageCount(params, data.count)}
          value={Math.ceil(params.offset / params.limit) + 1}
          size={"xs"}
          mt={"auto"}
          siblings={0}
          onChange={page => setParams({offset: PaginationUtil.getOffset(params, page)})}
        />
      </Group>
    </Stack>
  )
}
