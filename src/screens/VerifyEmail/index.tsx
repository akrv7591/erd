import {Button, Container, Group, Title} from "@mantine/core";
import classes from "./style.module.css"
import Logo from "@/components/common/Logo.tsx";
import {Link, NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import erdApi from "@/api/erdApi.ts";
import {useOnMount} from "@/hooks/useOnMount.ts";
import {notifications} from "@mantine/notifications";
import Timer from "@/utility/Timer.ts";
import {AxiosResponse} from "axios";
import {decodeJwt} from 'jose'
import React, {useState} from "react";
import StorageUtils from "@/utility/StorageUtils.ts";

const index = (tokenUuid: string | undefined) => erdApi.post(`/v1/verify-email/${tokenUuid}`)
const onVerificationError = () => {
  notifications.show({
    title: "Email verification failed",
    message: "Please try again"
  })
}

const onVerificationSuccess = (res: AxiosResponse, navigate: NavigateFunction, setError: React.Dispatch<React.SetStateAction<boolean>> ) => {
  notifications.show({
    id: "email-verify-success",
    title: "Email verification success",
    message: "Shortly you will be navigated to main page",
    loading: true,
    onOpen: () => {
      try {
        decodeJwt(res.data.accessToken)
        StorageUtils.setAuthorization(res.data.accessToken)
        Timer.sleep(4000).then(() => navigate("/library"))
      } catch (e) {
        setError(true)
        notifications.update({
          loading: false,
          id: "email-verify-success",
          title: "Email verification failed",
          message: "Please try again",
          color: "red"
        })
      }
    }
  })
}

export default function VerifyEmail() {
  const params = useParams<{ emailUuid: string }>()
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: index,
    onError: onVerificationError,
    onSuccess: (res) => onVerificationSuccess(res, navigate, setError)
  })

  useOnMount(() => {
    mutation.mutate(params.emailUuid)
  })

  const status = () => {
    if (error) return "error"
    switch (mutation.status) {
      case "pending":
        return "in progress"
      case "error":
        return "error"
      case "success":
        return "success"
      case "idle":
        return "idle"
    }
  }

  return (
    <Container className={classes.root}>
      <Group justify={"center"}>
        <Logo iconProps={{width:200, height: 200}}/>
      </Group>
      <Title order={3} className={classes.title} c={"dimmed"}>Email verification {status()}</Title>
      <Group justify="center" mt={50}>
        <Link to={"/"}>
          <Button size="md">
            Take me back to home page
          </Button>
        </Link>
      </Group>
    </Container>
  )
}
