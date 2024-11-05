import {AppShell, Button, Center, Group, Loader, Stack, Text, Title} from "@mantine/core";
import {Link, Navigate, useParams} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Header from "@/screens/Library/Header";
import {useOnMount} from "@/hooks";
import {teamInvitationJoinApi} from "@/api/logto/team";
import {memo} from "react";

const LottieAnimation = memo((props: {animationDataUrl: string}) => {
  if (!props.animationDataUrl) {
    return (
      <Center h={"200px"} w={"200px"}>
        <Loader size={"xl"}/>
      </Center>
    )
  }
  return (
    <DotLottieReact
      autoplay={true}
      src={props.animationDataUrl}
      style={{width: "200px"}}
    />
  )
})

export default function JoinTeam() {
  const {invitationId} = useParams()

  const {mutate, status, data: team, error} = useMutation({
    mutationKey: ["join-team", invitationId],
    mutationFn: teamInvitationJoinApi,
  })

  let value = ""
  let animationDataUrl = ""
  let description = ""

  switch (status) {
    case "pending":
      value = "Joining"
      break
    case "error":
      value = "Failed to join"
      animationDataUrl = "https://lottie.host/223a9a9e-d2dc-4822-ae27-ee6e3c3408b9/pFT9UXM8hA.lottie"
      console.warn(error)
      break
    case "success":
      value = "Successfully joined"
      animationDataUrl = "https://lottie.host/5f219143-0076-4f04-82b7-34fd2ba0df64/AB76si6vNZ.lottie"
  }

  useOnMount(() => {
    if (!invitationId) {
      return
    }

    mutate(invitationId)
  })


  if (!invitationId) {
    return <Navigate to={"/"}/>
  }


  return (
    <AppShell
      header={{height: 50}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main>
        <Center>
          <Stack h={"100%"} mt={"100px"} miw={"400px"}>
            <Group justify={"center"} w={"400px"} h={"200px"}>
              <LottieAnimation animationDataUrl={animationDataUrl} />
            </Group>
            <Group>
              <Title order={3}>{value} {team?.name}</Title>
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
      </AppShell.Main>
    </AppShell>
  )
}
