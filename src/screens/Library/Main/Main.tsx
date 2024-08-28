import {ActionIcon, Container, Group, Stack, Table, Text, Tooltip} from "@mantine/core";
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
import {IApiList} from "@/types/data/util.ts";
import Header from "@/screens/Library/Main/ErdTable/Header.tsx";
import Content from "@/screens/Library/Main/ErdTable/Content.tsx";
import Footer from "@/screens/Library/Main/Footer.tsx";
import {useElementSize} from "@mantine/hooks";
import {useEffect} from "react";
import {IErd} from "@/types/data/db-model-interfaces.ts";


export default function Main() {
  const modal = useModal<IErd>({initialOpen: false, baseTitle: "Erd", initialType: "view"})
  const team = useLibraryStore(state => state.team)
  const {ref, height} = useElementSize()
  const {params, setSearch, setParams} = useListQuery({containerHeight: height - 120, elementHeight: 50})
  const {data = {rows: [], count: 0}, status} = useQuery<IApiList<IErdWithSelected>>({
    queryKey: ['erdList', params],
    queryFn: () => {
      return erdListApi(params as IListQuery)
    },
    placeholderData: keepPreviousData,
  })

  const canCreateErd = team?.userTeam.role !== ROLE.READ

  useEffect(() => {
    setParams({
      teamId: team? team.id : null
    })
  }, [team])

  const handleErdCreateClick = () => modal.open({type: "create", data: null})

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
              <ActionIcon size={"md"} variant={"default"} onClick={handleErdCreateClick}>
                <IconPlus stroke={1} size={15}/>
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
        <Group justify={"space-between"}>
          <SearchInput onChange={q => setSearch(q)} size={"xs"} placeholder={"Search erd"}/>
        </Group>
        <Stack ref={ref} h={"calc(100vh - 180px)"}>
          <Table highlightOnHover={data.rows.length > 0} >
            <Header erds={data.rows}/>
            <Table.Tbody >
              <Content status={status} erds={data.rows}/>
            </Table.Tbody>
          </Table>
          <Footer total={data.count} params={params} setParams={setParams}/>
        </Stack>
      </Stack>
    </Container>
  )
}
