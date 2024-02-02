import {Container, Text} from "@mantine/core";
import {useMutation} from "react-query";
import erdApi from "@/api/erdApi";
import {useLocation} from "react-router-dom";
import {useOnMount} from "@/hooks/useOnMount.ts";

export default function SendEmailVerification() {
  const mutation = useMutation({
    mutationFn: data => erdApi.post("/v1/send-verification-email", data),
  })
  const location = useLocation()

  useOnMount(() => {
    mutation.mutate(location.state)
  })
  return (
    <Container>
      <Text>
        Registered successfully <br/>
        {mutation.isLoading
          ? "Sending verification email"
          : mutation.isSuccess
            ? "Verification email sent! Check your inbox"
            : "Sending error"
        }
      </Text>
    </Container>
  )
}
