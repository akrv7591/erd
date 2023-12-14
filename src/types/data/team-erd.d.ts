import {IErd} from "./erd";
import {ITeam} from "./team";

export interface ITeamErd {
  createdAt: Date
  updatedAt: Date

  // Permissions
  canRead: boolean
  canWrite: boolean
  canDelete: boolean

  //Foreign keys
  teamId: string
  erdId: string

  //Relations
  team?: ITeam
  erd?: IErd
}
