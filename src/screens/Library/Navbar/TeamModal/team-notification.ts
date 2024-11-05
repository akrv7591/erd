import {UserTeam} from "@/types/log-to/user-team";
import {notifications} from "@mantine/notifications";


export class TeamNotification {
  static handleAdd = (team: UserTeam) => {
    notifications.show({
      title: "Created",
      message: `${team.name} team created successfully created`,
      position: "bottom-right"
    })
  }

  static handleAddError = () => {
    notifications.show({
      title: "Failed",
      message: "Failed to create team! Try again",
      color: "red",
      position: "bottom-right"
    })
  }

  static handleUpdate = (team: UserTeam) => {
    notifications.show({
      message: `${team.name} team updated successfully`,
      position: "bottom-right"
    })
  }

  static handleUpdateError = () => {
    notifications.show({
      title: "Failed",
      message: "Failed to update team! Try again",
      color: "red",
      position: "bottom-right"
    })
  }

  static handleDelete = (team: UserTeam) => {
    notifications.show({
      title: "Deleted",
      message: `${team.name} team deleted successfully`
    })
  }

  static handleDeleteError = () => {
    notifications.show({
      title: "Failed",
      message: "Failed to delete team! Try again",
      color: "red"
    })
  }
}
