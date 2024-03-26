import erdApi from "@/api/erdApi.tsx";
import {notifications} from "@mantine/notifications";

interface DataProps {
  email: string,
  password: string
}


export const signInUser = (data: Omit<DataProps, 'name' | 'terms'>) => erdApi.post("/v1/auth/sign-in", data)

export const signingSuccess = () => {
  notifications.show({
    title: "Signed in successfully",
    message: "Welcome",
  })
}

export const signingError = () => {
  notifications.show({
    title: "Authentication failed",
    message: "Username or password is wrong",
    color: "red",
  })
}
