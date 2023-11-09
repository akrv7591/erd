import {ActionIcon, Container, Grid, Group, Loader, Text, Tooltip} from "@mantine/core";
import ErdModal from "./ErdModal";
import {useModal} from "../../hooks/useModal";
import {IconError404, IconPlus} from "@tabler/icons-react";
import React from "react";
import {Helmet} from "react-helmet-async";
import {useQuery} from "react-query";
import {IListQuery, useListQuery} from "../../hooks/useListQuery.ts";
import erdApi from "../../api/erdApi.tsx";
import {IPaginatedErd} from "../../types/data/erd";
import Erd from "./Erd";
import SearchInput from "../../components/common/SearchInput.tsx";

const listQueryFunction = async (params: IListQuery) => erdApi.get("/v1/erd", {params}).then(res => res.data)


export default function Library() {
  const modal = useModal({initialOpen: false, baseTitle: "Erd", initialType: "view"})
  const {params, setParams} = useListQuery()

  const {data, status, isSuccess} = useQuery<IPaginatedErd>({
    queryKey: ['erdList', params],
    queryFn: () => listQueryFunction(params)
  })

  const Content = () => {
    switch (status) {
      case "loading":
        return <Loader size={20}/>
      case "error":
        return <IconError404 size={20}/>
      case "success":
        if (data.rows.length === 0) return <Text>No erds</Text>

        return data.rows.map(erd => <Erd key={erd.id} erd={erd}/>)
    }
  }

  return (
    <Container fluid>
      <Helmet>
        <title>Erd list</title>
      </Helmet>
      <ErdModal {...modal.modalProps} />
      <Group justify={"space-between"} mt={"10px"}>
        <Text size={"sm"} c={"dimmed"}>
          Er diagrams
        </Text>
        <Tooltip label={"Create erd"}>
          <ActionIcon onClick={() => modal.open('create')}>
            <IconPlus stroke={1} size={15}/>
          </ActionIcon>
        </Tooltip>
      </Group>
      <Group mt={15} justify={"space-between"}>
        <SearchInput onChange={q => setParams({q})} size={"xs"} placeholder={"Search erd"}/>
      </Group>
      <Grid mt={20} style={{overflow: "visible"}}>
        {
          isSuccess && data.rows.length > 0
            ? <Content/>
            : (
              <Grid.Col span={12}>
                <Group w={"100%"} justify={"center"}>
                  <Content/>
                </Group>
              </Grid.Col>
            )
        }
      </Grid>
    </Container>
  )
}
