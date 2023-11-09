export interface IUserTeam {
  id: string
  createdAt: Date
  updatedAt: Date
  isAdmin: number

  //Foreign keys
  userId: string
  teamId: string
}
