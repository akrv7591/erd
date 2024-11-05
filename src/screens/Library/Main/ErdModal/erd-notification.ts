import {Erd} from "@/types/data/db-model-interfaces";
import {notifications} from "@mantine/notifications";



export class ErdNotification {
  static handleAdd = (erd: Erd) => {
    notifications.show({
      title: `${erd.name} erd is created`,
      message: "Success"
    })
  }

  static handleAddError = () => {
    notifications.show({
      title: `Failed to create erd`,
      message: "Failed",
      color: "var(--mantine-color-red-filled)"
    })
  }

  static handleUpdate = (erd: Erd) => {
    notifications.show({
      title: `${erd.name} erd is updated`,
      message: "Success"
    })
  }

  static handleUpdateError = () => {
    notifications.show({
      title: `Failed to update erd`,
      message: "Failed",
      color: "var(--mantine-color-red-filled)"
    })
  }

  static handleDelete = (erd: Erd) => {
    notifications.show({
      title: `${erd.name} erd is deleted`,
      message: "Success"
    })
  }

  static handleDeleteError = () => {
    notifications.show({
      title: `Failed to delete erd`,
      message: "Failed",
      color: "var(--mantine-color-red-filled)"
    })
  }
}
