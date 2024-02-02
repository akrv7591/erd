import {ActionIcon, Card, Checkbox, Container, Group, Loader, Stack, Table, Text, Tooltip} from "@mantine/core";
import ErdModal from "./ErdModal";
import {useModal} from "@/hooks/useModal.ts";
import {IconBolt, IconError404, IconPlus, IconTable} from "@tabler/icons-react";
import {Helmet} from "react-helmet-async";
import {useQuery} from "react-query";
import {IListQuery, useListQuery} from "@/hooks/useListQuery.ts";
import erdApi from "@/api/erdApi.tsx";
import Erd from "./Erd";
import SearchInput from "@/components/common/SearchInput.tsx";
import React from "react";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {IErd} from "@/types/data/db-model-interfaces";
import {IApiList} from "@/types/data/util";
import EmptyList from "@/components/common/EmptyList.tsx";
import {ROLE} from "@/enums/role.ts";

const listQueryFunction = async (params: IListQuery) => erdApi.get("/v1/erd", {params}).then(res => res.data)

export default function Main() {
  const modal = useModal({initialOpen: false, baseTitle: "Erd", initialType: "view"})
  const team = useLibraryStore(state => state.team)
  const teams = useLibraryStore(state => state.teams)
  const {params, setParams} = useListQuery()

  const {data, status, isSuccess} = useQuery<IApiList<IErd>>({
    queryKey: ['erdList', {...params, teamId: team ? [team.id] : teams.map(t => t.id)}],
    queryFn: (context) => {
      const [, params] = context.queryKey
      return listQueryFunction(params as IListQuery)
    }
  })

  const LoadingOrError = () => {
    switch (status) {
      case "loading":
        return <Loader size={20}/>
      case "error":
        return <IconError404/>
      default:
        return null
    }

  }

  const Content = () => {
    switch (status) {
      case "success":
        if (data.rows.length === 0) return (
          <Table.Tr>
            <Table.Td colSpan={7}>
              <EmptyList/>
            </Table.Td>
          </Table.Tr>
        )

        return data.rows.map(erd => <Erd key={erd.id} erd={erd}/>)
    }
  }

  React.useEffect(() => {
    setParams(({teamId: team?.id}))
  }, [team])

  const canCreateErd = team?.UserTeam.role !== ROLE.READ

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
              <ActionIcon variant={"default"} onClick={() => modal.open('create')}>
                <IconPlus stroke={1} size={15}/>
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
        <Group justify={"space-between"}>
          <SearchInput onChange={q => setParams({q})} size={"xs"} placeholder={"Search erd"}/>
        </Group>
        <Card h={"calc(100vh - 175px)"}>
          <Table mt={20} style={{overflow: "visible"}} highlightOnHover
                 highlightOnHoverColor={"var(--mantine-color-dark-7)"}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Checkbox/>
                </Table.Th>
                <Table.Th>
                  <Text>Name</Text>
                </Table.Th>
                <Table.Th>
                  <Group gap={"5px"}>
                    <IconTable stroke={1} size={20}/>
                    <Text>Entities</Text>
                  </Group>
                </Table.Th>
                <Table.Th>
                  <Text>Created at</Text>
                </Table.Th>
                <Table.Th>
                  <Text>Updated at</Text>
                </Table.Th>
                <Table.Th>
                  <Text>Role</Text>
                </Table.Th>
                <Table.Th>
                  <Group gap={"5px"}>
                    <IconBolt/>
                    <Text>Actions</Text>
                  </Group>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            {isSuccess ? (
              <Table.Tbody>
                <Content/>
              </Table.Tbody>
            ) : (
              <Table.Caption>
                <Group justify={"center"} w={"100%"}>
                  <LoadingOrError/>
                </Group>
              </Table.Caption>
            )}
          </Table>
        </Card>
      </Stack>
    </Container>
  )
}
