import {Container, Group, Stack, Table, Text} from "@mantine/core";
import {Helmet} from "react-helmet-async";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {IListQuery, useListQuery} from "@/hooks/useListQuery.ts";
import SearchInput from "@/components/common/SearchInput.tsx";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {erdListApi} from "@/api/erd.ts";
import {IApiList} from "@/types/data/util.ts";
import Header from "@/screens/Library/Main/ErdTable/Header.tsx";
import Content from "@/screens/Library/Main/ErdTable/Content.tsx";
import Footer from "@/screens/Library/Main/Footer.tsx";
import {useElementSize} from "@mantine/hooks";
import {useEffect} from "react";
import {IErd} from "@/types/data/db-model-interfaces.ts";
import {CreateTeamButton} from "@/screens/Library/Main/CreateTeamButton.tsx";

export default function Main() {
  const team = useLibraryStore(state => state.team)
  const {ref, height} = useElementSize()
  const {params, setSearch, setParams} = useListQuery({containerHeight: height - 120, elementHeight: 50})
  const {data = {rows: [], count: 0}, status} = useQuery<IApiList<IErd>, {}, IApiList<IErd>, [string, IListQuery]>({
    queryKey: ['erdList', params],
    queryFn: erdListApi,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setParams({
      teamId: team ? team.id : null
    })
  }, [team])

  return (
    <Container fluid>
      <Helmet>
        <title>Erd list</title>
      </Helmet>
      <Stack py={"xs"}>
        <Group justify={"space-between"} h={"28px"}>
          <Text size={"sm"} c={"dimmed"}>
            {team ? team.name + "'s" : "All"} er diagrams
          </Text>
          <CreateTeamButton team={team}/>
        </Group>
        <Group justify={"space-between"}>
          <SearchInput onChange={q => setSearch(q)} size={"xs"} placeholder={"Search erd"}/>
        </Group>
        <Stack ref={ref} h={"calc(100vh - 180px)"}>
          <Table highlightOnHover={data.rows.length > 0}>
            <Header erds={data.rows}/>
            <Table.Tbody>
              <Content status={status} erds={data.rows}/>
            </Table.Tbody>
          </Table>
          <Footer total={data.count} params={params} setParams={setParams}/>
        </Stack>
      </Stack>
    </Container>
  )
}
