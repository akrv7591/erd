import {AppShell, Button, Center, Group, Loader, Stack, Text, Title} from "@mantine/core";
import {Link, useParams} from "react-router-dom";
import {QueryFunctionContext, useQuery} from "react-query";
import erdApi from "@/api/erdApi.tsx";
import {ITeam} from "@/types/data/db-model-interfaces";
import {DotLottiePlayer} from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

import {EMAIL_VERIFICATION_ERRORS} from "@/enums/verification-token.ts";
import Header from "@/screens/Library/Header";


const verifyQueryFn = (teamId: string) => erdApi.post(`/v1/verify-join-team-email/${teamId}`)
const teamQueryFn = (params: QueryFunctionContext) => erdApi.get<ITeam>(`/v1/team/${params.queryKey[1]}`).then(res => res.data)

interface Props {
  team: ITeam
}

const VerifyEmailAndJoinTeam = ({team}: Props) => {
  const verifyEmail = useQuery({
    queryKey: [team.id],
    queryFn: () => verifyQueryFn(team.id),
    retry: false,
  })

  let value = ""
  let animationDataUrl = ""
  let description = ""
  switch (verifyEmail.status) {
    case "loading":
      value = "Joining"
      break
    case "error":
      value = "Failed to join"
      animationDataUrl = "https://lottie.host/223a9a9e-d2dc-4822-ae27-ee6e3c3408b9/pFT9UXM8hA.lottie"
      // @ts-ignore
      switch (verifyEmail.error.response.data.code as EMAIL_VERIFICATION_ERRORS) {
        case EMAIL_VERIFICATION_ERRORS.EXPIRED:
          description = "Verification token is expired"
          break

        case EMAIL_VERIFICATION_ERRORS.NOT_FOUND:
          description = "Verification token not found"
          break

        case EMAIL_VERIFICATION_ERRORS.INVALID:
          description = "Verification token invalid"
          break
      }
      break
    case "success":
      value = "Successfully joined"
      animationDataUrl = "https://lottie.host/5f219143-0076-4f04-82b7-34fd2ba0df64/AB76si6vNZ.lottie"
  }

  return (
    <Center>
      <Stack h={"100%"} mt={"100px"} miw={"400px"}>
        <Group justify={"center"} w={"400px"} h={"200px"}>
          {!verifyEmail.isLoading ?
            //
            //   <dotlottie-player
            //   autoplay={true}
            //   src={animationDataUrl}
            //   style={{width: "200px"}}
            // />

            <DotLottiePlayer
              autoplay={true}
              src={animationDataUrl}
              style={{width: "200px"}}
            />
            : (
              <Center h={"200px"} w={"200px"}>
                <Loader size={"xl"}/>
              </Center>
            )}
        </Group>
        <Group>
          <Title order={3}>{value} {team.name}</Title>
        </Group>
        <Group>
          {description && <Text>{description}</Text>}
        </Group>
        <Group>
          <Text>Continue to ...</Text>
        </Group>
        <Group>
          <Link to={"/"} style={{flex: 1, textDecoration: "none"}}>
            <Button fullWidth variant={"default"}>Home</Button>
          </Link>
          <Link to={"/library"} style={{flex: 1, textDecoration: "none"}}>
            <Button fullWidth variant={"filled"}>Library</Button>
          </Link>
        </Group>
      </Stack>
    </Center>
  )
}


export function Component() {
  const params = useParams()
  const team = useQuery({
    queryKey: ["joinTeam", params.joinTeamId],
    queryFn: teamQueryFn,
    retry: false
  })

  return (
    <AppShell
      header={{height: 50}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main>
        {team.data ? <VerifyEmailAndJoinTeam team={team.data}/> : null}
      </AppShell.Main>
    </AppShell>
  )
}
