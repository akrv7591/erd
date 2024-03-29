import {ROLE} from "@/enums/role.ts";

export const roleData = [{
  value: ROLE.READ,
  label: "Spectator"
}, {
  value: ROLE.WRITE,
  label: "Contributor"
}, {
  value: ROLE.ADMIN,
  label: "Admin"
}]

export const getRoleDescription = (role: ROLE) => {
  switch (role) {
    case ROLE.READ:
      return "User can only view erd"
    case ROLE.WRITE:
      return "User can create and edit erd"
    case ROLE.ADMIN:
      return "User have all privileges"
  }
}

export const hasRoleAccess = (role: ROLE) => {
  switch (role) {
    case ROLE.READ:
      return false
    case ROLE.WRITE:
      return true
    case ROLE.ADMIN:
      return true
    default:
      return false
  }
}
