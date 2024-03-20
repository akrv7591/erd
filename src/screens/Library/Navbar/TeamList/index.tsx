import {useQuery} from "@tanstack/react-query";
import {Flex, Loader, Pagination, Stack, Text} from "@mantine/core";
import {IconError404} from "@tabler/icons-react";
import Team from "./Team.tsx";
import SearchInput from "@/components/common/SearchInput.tsx";
import {useListQuery} from "@/hooks/useListQuery.ts";
import {teamListApi} from "@/api/team.ts";


export default function TeamList() {
  const {params, setParams} = useListQuery()
  const {data = {rows: [], count: 0}, status} = useQuery({
    queryKey: ['teamList', params],
    queryFn: () => teamListApi(params),
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
    <Stack w={"100%"} gap={0} px={5} align={"center"} h={"calc(100vh - 130px)"}>
      <Flex w={"100%"} mb={"md"}>
        <SearchInput
          size={"xs"}
          w={"100%"}
          onChange={(q) => setParams({q, offset: 0})}
          placeholder={"Search team"}
        />
      </Flex>
      <Content/>
      <Pagination
        total={Math.ceil((data?.count || 0) / params.limit)}
        value={params.offset / params.limit + 1}
        size={"xs"}
        mt={"auto"}
        siblings={0}
        onChange={v => setParams({offset: (v - 1) * params.limit})}
      />
    </Stack>
  )
}
