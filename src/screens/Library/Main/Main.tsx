import {ActionIcon, Card, Container, Group, Stack, Table, Text, Tooltip} from "@mantine/core";
import ErdModal from "./ErdModal";
import {useModal} from "@/hooks/useModal.ts";
import {IconPlus} from "@tabler/icons-react";
import {Helmet} from "react-helmet-async";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {IListQuery, useListQuery} from "@/hooks/useListQuery.ts";
import SearchInput from "@/components/common/SearchInput.tsx";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {ROLE} from "@/enums/role.ts";
import {erdListApi, IErdWithSelected} from "@/api/erd.ts";
import {IApiList} from "@/types/data/util";
import Header from "@/screens/Library/Main/ErdTable/Header.tsx";
import Content from "@/screens/Library/Main/ErdTable/Content.tsx";
import Footer from "@/screens/Library/Main/Footer.tsx";


export default function Main() {
  const modal = useModal({initialOpen: false, baseTitle: "Erd", initialType: "view"})
  const team = useLibraryStore(state => state.team)
  const teams = useLibraryStore(state => state.teams)
  const {params, setSearch, setParams} = useListQuery()
  const {data = {rows: [], count: 0}, status} = useQuery<IApiList<IErdWithSelected>>({
    queryKey: ['erdList', {
      teamId: team ? [team.id] : teams.map(t => t.id),
      ...params
    }],
    queryFn: (context) => {
      const [, params] = context.queryKey
      return erdListApi(params as IListQuery)
    },
    placeholderData: keepPreviousData,
  })

  const canCreateErd = team?.userTeam.role !== ROLE.READ

  return (
    <Container fluid>
      <ErdModal key={team ? team.id : null} {...modal.modalProps} />
      <Helmet>
        <title>Erd list</title>
      </Helmet>
      <Stack py={"xs"}>
        <Group justify={"space-between"} h={"28px"}>
          <Text size={"sm"} c={"dimmed"}>
            {team ? team.name + "'s" : "All"} er diagrams
          </Text>
          {canCreateErd && (
            <Tooltip label={"Create erd"}>
              <ActionIcon size={"md"} variant={"default"} onClick={() => modal.open('create')}>
                <IconPlus stroke={1} size={15}/>
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
        <Group justify={"space-between"}>
          <SearchInput onChange={q => setSearch(q)} size={"xs"} placeholder={"Search erd"}/>
        </Group>
        <Card h={"calc(100vh - 180px)"}>
          <Table mt={20} highlightOnHover highlightOnHoverColor={"var(--mantine-color-dark-7)"}>
            <Header erds={data.rows}/>
            <Table.Tbody>
              <Content status={status} erds={data.rows}/>
            </Table.Tbody>
          </Table>
          <Footer total={data.count} params={params} setParams={setParams}/>
        </Card>
      </Stack>
    </Container>
  )
}
