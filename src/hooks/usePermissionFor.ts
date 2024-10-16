import {useMemo} from "react";

export enum PERMISSION_FOR {
  CREATE_ERD = "CREATE_ERD",
  UPDATE_ERD = "UPDATE_ERD",
  DELETE_ERD = "DELETE_ERD",
}

export const usePermissionFor = (roleNames: string[], permission: PERMISSION_FOR) => {
  if (!(permission in PERMISSION_FOR)) {
    throw new Error("permission should be one of PERMISSION enum")
  }

  const userRoles = useMemo(() => new Set(roleNames), [roleNames])

  return useMemo(() => {
    switch (permission) {
      case PERMISSION_FOR.CREATE_ERD:
        return new Set(['admin', 'owner']).intersection(userRoles).size > 0
      case PERMISSION_FOR.UPDATE_ERD:
        return new Set(['admin', 'owner', 'contributor']).intersection(userRoles).size > 0
      case PERMISSION_FOR.DELETE_ERD:
        return new Set(['admin', 'owner']).intersection(userRoles).size > 0
    }
  }, [permission, roleNames])
}
