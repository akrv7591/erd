import erdApi from "@/api/erdApi.tsx";
import {useQuery} from "react-query";
import {Loader, Pagination, Stack, Text} from "@mantine/core";
import {IconError404} from "@tabler/icons-react";
import Team from "./Team.tsx";
import SearchInput from "@/components/common/SearchInput.tsx";
import {IListQuery, useListQuery} from "@/hooks/useListQuery.ts";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {IApiList} from "@/types/data/util";
import {IFormTeam} from "@/contexts/forms/TeamFormContext.ts";

const teamQueryFunction = (params: IListQuery) => erdApi.get("/v1/team", {
  params
}).then(res => res.data)

export default function TeamList() {
  const {params, setParams} = useListQuery()
  const {data, status} = useQuery<IApiList<IFormTeam>>({
    queryKey: ['teamList', params],
    queryFn: () => teamQueryFunction(params),
    onSuccess: data => useLibraryStore.setState({teams: data.rows})
  })

  const Content = () => {
    switch (status) {
      case "loading":
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
    <Stack w={"100%"} gap={"5px"} align={"center"}>
      <SearchInput
        size={"xs"}
        mb={"lg"}
        w={"100%"}
        onChange={(q) => setParams({q, offset: 0})}
        placeholder={"Search team"}/>
      <Content/>
      <Pagination
        total={Math.ceil((data?.count || 0) / params.limit)}
        value={params.offset / params.limit + 1}
        size={"xs"}
        mt={"lg"}
        siblings={0}
        onChange={v => setParams({offset: (v - 1) * params.limit})}
      />
    </Stack>
  )
}
