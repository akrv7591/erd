import erdApi from "@/api/erdApi.ts";
import {useQuery} from "@tanstack/react-query";
import {Loader, Pagination, Stack, Text} from "@mantine/core";
import {IconError404} from "@tabler/icons-react";
import User from "./User.tsx";
import SearchInput from "@/components/common/SearchInput.tsx";
import {IListQuery, useListQuery} from "@/hooks/useListQuery.ts";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import React from "react";
import {IApiList} from "@/types/data/util.ts";
import {IUser} from "@/types/data/db-model-interfaces.ts";

const teamQueryFunction = (params: IListQuery) => erdApi.get("/v1/users", {
  params
}).then(res => res.data)

export default function UserList() {
  const {params, setParams} = useListQuery()
  const team = useLibraryStore(state => state.team)
  const paramsWithTeam = React.useMemo(() => ({...params, teamId: team?.id}), [team, params])
  const {data, status} = useQuery<IApiList<IUser>>({
    queryKey: ['userList', paramsWithTeam],
    queryFn: () => teamQueryFunction(paramsWithTeam)
  })

  const Content = () => {
    switch (status) {
      case "pending":
        return <Loader size={"xs"} mt={"lg"} c={"var(--mantine-color-blue-light)"}/>
      case "error":
        return <IconError404/>
      case "success":
        if (data.rows.length === 0) return (
          <Text size={"xs"} mt={"lg"}>No users</Text>
        )

        return (
          <>
            {data.rows.map(user => <User key={user.id} user={user}/>)}
          </>
        )
    }
  }

  return (
    <Stack w={"100%"} gap={"5px"} align={"center"}  h={"calc(100vh - 130px)"}>
      <SearchInput
        size={"xs"}
        mb={"lg"}
        w={"100%"}
        onChange={(q) => setParams({q, offset: 0})}
        placeholder={"Search user"}/>
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
