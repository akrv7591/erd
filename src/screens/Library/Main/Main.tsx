import {Container, Group, SimpleGrid, Stack, Text} from "@mantine/core";
import {Helmet} from "react-helmet-async";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {erdApis} from "@/api/erd";
import {memo} from "react";
import {CreateErdButton} from "./CreateErdButton";
import {ErdItem} from "@/screens/Library/Main/ErdItem";
import { useSelectedTeam, useUser } from "@/hooks";

export const Main = memo(() => {
  const {selectedTeam} = useSelectedTeam()
  const user = useUser()
  const {data = []} = useQuery({
    queryKey: ['erdList', selectedTeam?.id || user.data.id],
    queryFn: erdApis.listQuery,
    placeholderData: keepPreviousData,
  })

  return (
    <Container fluid>
      <Helmet>
        <title>Erd list</title>
      </Helmet>
      <Stack py={"xs"}>
        <Group justify={"space-between"} h={"28px"}>
          <Text size={"sm"} c={"dimmed"}>
            {!selectedTeam ? "Your personal diagrams" : selectedTeam.name + " team's diagrams"}
          </Text>
          <CreateErdButton team={selectedTeam}/>
        </Group>
        <Stack h={"calc(100vh - 180px)"}>
          <SimpleGrid cols={{xs: 1, sm: 2, md: 3, lg: 4, xl: 5}} spacing={"xs"}>
            {data.map(erd => (
              <ErdItem data={erd} key={erd.id}/>
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Container>
  )
})
