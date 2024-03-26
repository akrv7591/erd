import {notifications} from "@mantine/notifications";
import {AxiosApiError} from "@/types/api";
import {AUTH} from "@/enums/auth.ts";

export const handleSuccessNotification = () => {
  notifications.show({
    title: "Password set",
    message: "New password has been set",
  })
}


export const handleErrorNotification = (err: AxiosApiError) => {
  switch (err.response.data.code) {
    case AUTH.EMAIL_AND_PASSWORD_REQUIRED:
  }

  notifications.show({
    title: "Set password",
    message: "Failed! Try again",
    color: "red"
  })
}
