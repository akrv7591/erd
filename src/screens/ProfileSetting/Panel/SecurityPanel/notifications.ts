import {notifications} from "@mantine/notifications";

export const handleSuccessNotification = () => {
  notifications.show({
    title: "Password set",
    message: "New password has been set",
  })
}


export const handleErrorNotification = () => {
  notifications.show({
    title: "Set password",
    message: "Failed! Try again",
    color: "red"
  })
}
